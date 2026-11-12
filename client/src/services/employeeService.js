import api from './api';

/**
 * Service layer for PeopleDesk Employee REST API operations.
 */
export const employeeService = {
  /**
   * Fetch paginated employees with search, filter, and sort options
   * @param {Object} params - { search, department, status, sortBy, sortOrder, page, limit }
   * @returns {Promise<Object>} { success, count, pagination, data }
   */
  async getEmployees(params = {}) {
    const cleanParams = {};
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params.department && params.department !== 'All') cleanParams.department = params.department;
    if (params.status && params.status !== 'All') cleanParams.status = params.status;
    if (params.sortBy) cleanParams.sortBy = params.sortBy;
    if (params.sortOrder) cleanParams.sortOrder = params.sortOrder;
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;

    return await api.get('/employees', { params: cleanParams });
  },

  /**
   * Fetch single employee by MongoDB ObjectId
   * @param {string} id 
   * @returns {Promise<Object>} { success, data }
   */
  async getEmployeeById(id) {
    return await api.get(`/employees/${id}`);
  },

  /**
   * Create a new employee record
   * @param {Object} employeeData - { fullName, email, department, designation, status }
   * @returns {Promise<Object>} { success, message, data }
   */
  async createEmployee(employeeData) {
    return await api.post('/employees', employeeData);
  },

  /**
   * Update existing employee details
   * @param {string} id 
   * @param {Object} employeeData - { fullName, email, department, designation, status }
   * @returns {Promise<Object>} { success, message, data }
   */
  async updateEmployee(id, employeeData) {
    return await api.put(`/employees/${id}`, employeeData);
  },

  /**
   * Update employee status (Active / Inactive)
   * @param {string} id 
   * @param {string} status - 'Active' | 'Inactive'
   * @returns {Promise<Object>} { success, message, data }
   */
  async updateEmployeeStatus(id, status) {
    return await api.patch(`/employees/${id}/status`, { status });
  },

  /**
   * Delete employee by MongoDB ObjectId
   * @param {string} id 
   * @returns {Promise<Object>} { success, message, data }
   */
  async deleteEmployee(id) {
    return await api.delete(`/employees/${id}`);
  },
};

export default employeeService;

