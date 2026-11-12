import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
} from '../controllers/employeeController.js';

const router = express.Router();

// Root employee collection endpoints
router.route('/')
  .get(getEmployees)
  .post(createEmployee);

// Individual employee resource endpoints
router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

// Employee status specific endpoint
router.patch('/:id/status', updateEmployeeStatus);

export default router;

