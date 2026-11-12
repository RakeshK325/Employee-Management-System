import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

/**
 * @desc    Get all employees with search, filter, sort and pagination
 * @route   GET /api/employees
 * @access  Public
 */
export const getEmployees = async (req, res, next) => {
  try {
    const { 
      search, 
      department, 
      status, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = {};

    // 1. Text search across fullName, email, and department
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { designation: searchRegex },
      ];
    }

    // 2. Department filter
    if (department && department.trim() !== '' && department.toLowerCase() !== 'all') {
      filter.department = { $regex: new RegExp(`^${department.trim()}$`, 'i') };
    }

    // 3. Status filter (Active / Inactive)
    if (status && status.trim() !== '' && status.toLowerCase() !== 'all') {
      filter.status = status.trim();
    }

    // 4. Sorting logic
    const sortFieldMap = {
      name: 'fullName',
      fullname: 'fullName',
      email: 'email',
      department: 'department',
      designation: 'designation',
      status: 'status',
      createdat: 'createdAt',
      createdAt: 'createdAt',
      date: 'createdAt',
    };

    const targetSortField = sortFieldMap[sortBy.toLowerCase()] || 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' || sortOrder === '1' ? 1 : -1;
    const sortOptions = { [targetSortField]: sortDirection };

    // 5. Pagination logic
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (parsedPage - 1) * parsedLimit;

    // Execute query and total count in parallel
    const [employees, totalEmployees] = await Promise.all([
      Employee.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Employee.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalEmployees / parsedLimit) || 1;

    res.status(200).json({
      success: true,
      count: employees.length,
      pagination: {
        totalEmployees,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single employee by ID
 * @route   GET /api/employees/:id
 * @access  Public
 */
export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID format: '${id}' is not a valid MongoDB ObjectId`,
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new employee record
 * @route   POST /api/employees
 * @access  Public
 */
export const createEmployee = async (req, res, next) => {
  try {
    const { fullName, email, department, designation, status } = req.body;

    // Validate required fields explicitly
    const missingFields = [];
    if (!fullName || !fullName.trim()) missingFields.push('fullName');
    if (!email || !email.trim()) missingFields.push('email');
    if (!department || !department.trim()) missingFields.push('department');
    if (!designation || !designation.trim()) missingFields.push('designation');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(', ')}`,
      });
    }

    // Check for existing duplicate email
    const existingEmployee = await Employee.findOne({ 
      email: email.trim().toLowerCase() 
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: `An employee with email '${email.trim().toLowerCase()}' already exists`,
      });
    }

    // Create record
    const newEmployee = await Employee.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      designation: designation.trim(),
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee details
 * @route   PUT /api/employees/:id
 * @access  Public
 */
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID format: '${id}' is not a valid MongoDB ObjectId`,
      });
    }

    const { fullName, email, department, designation, status } = req.body;

    // Verify employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${id}`,
      });
    }

    // If email is being updated, verify uniqueness
    if (email && email.trim().toLowerCase() !== employee.email) {
      const emailConflict = await Employee.findOne({ 
        email: email.trim().toLowerCase(),
        _id: { $ne: id }
      });

      if (emailConflict) {
        return res.status(400).json({
          success: false,
          message: `An employee with email '${email.trim().toLowerCase()}' already exists`,
        });
      }
    }

    // Apply updates
    if (fullName !== undefined) employee.fullName = fullName.trim();
    if (email !== undefined) employee.email = email.trim().toLowerCase();
    if (department !== undefined) employee.department = department.trim();
    if (designation !== undefined) employee.designation = designation.trim();
    if (status !== undefined) {
      if (!['Active', 'Inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value. Status must be either "Active" or "Inactive"',
        });
      }
      employee.status = status;
    }

    const updatedEmployee = await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee status only (Active / Inactive)
 * @route   PATCH /api/employees/:id/status
 * @access  Public
 */
export const updateEmployeeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID format: '${id}' is not a valid MongoDB ObjectId`,
      });
    }

    if (!status || !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Status must be either "Active" or "Inactive"',
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${id}`,
      });
    }

    employee.status = status;
    const updatedEmployee = await employee.save();

    res.status(200).json({
      success: true,
      message: `Employee status successfully updated to '${status}'`,
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete employee by ID
 * @route   DELETE /api/employees/:id
 * @access  Public
 */
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID format: '${id}' is not a valid MongoDB ObjectId`,
      });
    }

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {
        id: employee._id,
        fullName: employee.fullName,
        email: employee.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
