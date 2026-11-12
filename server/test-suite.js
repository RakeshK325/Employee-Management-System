import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes/api.js';
import { notFound } from './src/middleware/notFound.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import Employee from './src/models/Employee.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

const testResults = [];

const recordTest = (name, passed, details = '') => {
  testResults.push({ name, passed, details });
  const symbol = passed ? '✅' : '❌';
  console.log(`${symbol} ${name} ${details ? '(' + details + ')' : ''}`);
};

const runSuite = async () => {
  console.log('\n======================================================');
  console.log('🚀 Starting PeopleDesk Phase 2 Backend Test Suite');
  console.log('======================================================\n');

  // 1. Database Connection Test
  let conn;
  try {
    conn = await mongoose.connect(uri);
    recordTest('MongoDB Atlas Connection', true, `Connected to cluster host: ${conn.connection.host}`);
  } catch (err) {
    recordTest('MongoDB Atlas Connection', false, err.message);
    process.exit(1);
  }

  // Set up Express test server
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  const server = await new Promise((resolve) => {
    const s = app.listen(TEST_PORT, () => {
      console.log(`[Test Server] Listening on ${BASE_URL}\n`);
      resolve(s);
    });
  });

  // Clean up any previous test records
  await Employee.deleteMany({ email: /@peopledesk-test\.com$/ });

  let createdEmp1Id = null;
  let createdEmp2Id = null;
  let createdEmp3Id = null;

  try {
    // 2. Health Endpoint
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    recordTest(
      'GET /api/health',
      healthRes.status === 200 && healthData.status === 'healthy' && healthData.database === 'connected',
      `Status: ${healthRes.status}, DB: ${healthData.database}`
    );

    // 3. Create Employee 1 (Happy path)
    const emp1Payload = {
      fullName: 'Sarah Jenkins',
      email: 'sarah.jenkins@peopledesk-test.com',
      department: 'Engineering',
      designation: 'Staff Systems Architect',
      status: 'Active',
    };
    const create1Res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp1Payload),
    });
    const create1Data = await create1Res.json();
    createdEmp1Id = create1Data.data?._id;
    recordTest(
      'POST /api/employees (Create Employee 1)',
      create1Res.status === 201 && create1Data.data?.email === emp1Payload.email,
      `Status: ${create1Res.status}, Created ID: ${createdEmp1Id}`
    );

    // 4. Duplicate Email Rejection
    const dupRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp1Payload),
    });
    const dupData = await dupRes.json();
    recordTest(
      'POST /api/employees (Duplicate Email Rejection)',
      dupRes.status === 400 && dupData.success === false,
      `Status: ${dupRes.status}, Message: "${dupData.message}"`
    );

    // 5. Validation Error (Missing required fields)
    const invalidPayloadRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Only Name' }),
    });
    const invalidPayloadData = await invalidPayloadRes.json();
    recordTest(
      'POST /api/employees (Missing Required Fields Rejection)',
      invalidPayloadRes.status === 400 && invalidPayloadData.success === false,
      `Status: ${invalidPayloadRes.status}`
    );

    // 6. Create Employee 2 & 3 for list, filter, and pagination testing
    const emp2Res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Marcus Vance',
        email: 'marcus.vance@peopledesk-test.com',
        department: 'Product Design',
        designation: 'Lead UX Researcher',
        status: 'Active',
      }),
    });
    const emp2Data = await emp2Res.json();
    createdEmp2Id = emp2Data.data?._id;

    const emp3Res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Amina Al-Mansoor',
        email: 'amina.almansoor@peopledesk-test.com',
        department: 'Engineering',
        designation: 'Backend Engineer',
        status: 'Inactive',
      }),
    });
    const emp3Data = await emp3Res.json();
    createdEmp3Id = emp3Data.data?._id;

    recordTest(
      'POST /api/employees (Create Additional Employees for testing)',
      emp2Res.status === 201 && emp3Res.status === 201,
      `Created IDs: ${createdEmp2Id}, ${createdEmp3Id}`
    );

    // 7. GET /api/employees (Retrieve all)
    const listRes = await fetch(`${BASE_URL}/employees`);
    const listData = await listRes.json();
    recordTest(
      'GET /api/employees (Retrieve List)',
      listRes.status === 200 && Array.isArray(listData.data) && listData.pagination?.totalEmployees >= 3,
      `Count: ${listData.count}, Total: ${listData.pagination?.totalEmployees}`
    );

    // 8. GET /api/employees/:id (Retrieve single employee)
    const singleRes = await fetch(`${BASE_URL}/employees/${createdEmp1Id}`);
    const singleData = await singleRes.json();
    recordTest(
      'GET /api/employees/:id (Retrieve Single Employee)',
      singleRes.status === 200 && singleData.data?._id === createdEmp1Id,
      `Found: ${singleData.data?.fullName}`
    );

    // 9. GET /api/employees/:id with Invalid ObjectId
    const invalidIdRes = await fetch(`${BASE_URL}/employees/not-a-valid-object-id`);
    const invalidIdData = await invalidIdRes.json();
    recordTest(
      'GET /api/employees/:id (Invalid ObjectId Format Rejection)',
      invalidIdRes.status === 400 && invalidIdData.success === false,
      `Status: ${invalidIdRes.status}, Message: "${invalidIdData.message}"`
    );

    // 10. GET /api/employees/:id with Nonexistent Valid ObjectId
    const nonExistentId = '507f1f77bcf86cd799439011';
    const notFoundRes = await fetch(`${BASE_URL}/employees/${nonExistentId}`);
    const notFoundData = await notFoundRes.json();
    recordTest(
      'GET /api/employees/:id (Nonexistent Employee 404 Response)',
      notFoundRes.status === 404 && notFoundData.success === false,
      `Status: ${notFoundRes.status}`
    );

    // 11. PUT /api/employees/:id (Update details)
    const updateRes = await fetch(`${BASE_URL}/employees/${createdEmp1Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Sarah Jenkins-Cole',
        designation: 'Principal Systems Architect',
      }),
    });
    const updateData = await updateRes.json();
    recordTest(
      'PUT /api/employees/:id (Update Details)',
      updateRes.status === 200 && updateData.data?.fullName === 'Sarah Jenkins-Cole' && updateData.data?.designation === 'Principal Systems Architect',
      `Updated Name: ${updateData.data?.fullName}, Role: ${updateData.data?.designation}`
    );

    // 12. PATCH /api/employees/:id/status (Valid update)
    const statusRes = await fetch(`${BASE_URL}/employees/${createdEmp1Id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Inactive' }),
    });
    const statusData = await statusRes.json();
    recordTest(
      'PATCH /api/employees/:id/status (Set Inactive)',
      statusRes.status === 200 && statusData.data?.status === 'Inactive',
      `Status: ${statusRes.status}, New Status: ${statusData.data?.status}`
    );

    // 13. PATCH /api/employees/:id/status (Invalid status rejection)
    const invalidStatusRes = await fetch(`${BASE_URL}/employees/${createdEmp1Id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Terminated' }),
    });
    const invalidStatusData = await invalidStatusRes.json();
    recordTest(
      'PATCH /api/employees/:id/status (Invalid Status Rejection)',
      invalidStatusRes.status === 400 && invalidStatusData.success === false,
      `Status: ${invalidStatusRes.status}, Message: "${invalidStatusData.message}"`
    );

    // 14. Search Query Test
    const searchRes = await fetch(`${BASE_URL}/employees?search=Jenkins`);
    const searchData = await searchRes.json();
    recordTest(
      'GET /api/employees?search=Jenkins (Text Search)',
      searchRes.status === 200 && searchData.data.some((e) => e.fullName.includes('Jenkins')),
      `Matches found: ${searchData.count}`
    );

    // 15. Department Filter Test
    const deptRes = await fetch(`${BASE_URL}/employees?department=Product%20Design`);
    const deptData = await deptRes.json();
    recordTest(
      'GET /api/employees?department=Product Design (Filter)',
      deptRes.status === 200 && deptData.data.every((e) => e.department === 'Product Design'),
      `Department matches: ${deptData.count}`
    );

    // 16. Status Filter Test
    const statusFilterRes = await fetch(`${BASE_URL}/employees?status=Inactive`);
    const statusFilterData = await statusFilterRes.json();
    recordTest(
      'GET /api/employees?status=Inactive (Status Filter)',
      statusFilterRes.status === 200 && statusFilterData.data.every((e) => e.status === 'Inactive'),
      `Inactive records found: ${statusFilterData.count}`
    );

    // 17. Sorting Test
    const sortRes = await fetch(`${BASE_URL}/employees?sortBy=fullName&sortOrder=asc&limit=10`);
    const sortData = await sortRes.json();
    const names = sortData.data.map((e) => e.fullName);
    const isSorted = names.slice(1).every((n, i) => n.localeCompare(names[i]) >= 0);
    recordTest(
      'GET /api/employees?sortBy=fullName&sortOrder=asc (Sorting)',
      sortRes.status === 200 && isSorted,
      `Ascending order verified: [${names.join(', ')}]`
    );

    // 18. Pagination Test
    const pageRes = await fetch(`${BASE_URL}/employees?page=1&limit=2`);
    const pageData = await pageRes.json();
    recordTest(
      'GET /api/employees?page=1&limit=2 (Pagination)',
      pageRes.status === 200 && pageData.data.length <= 2 && pageData.pagination?.limit === 2 && pageData.pagination?.currentPage === 1,
      `Page: ${pageData.pagination?.currentPage}, Limit: ${pageData.pagination?.limit}, Total: ${pageData.pagination?.totalEmployees}`
    );

    // 19. Data Persistence Verification
    const directDoc = await Employee.findById(createdEmp2Id);
    recordTest(
      'Database Direct Persistence Verification',
      directDoc !== null && directDoc.email === 'marcus.vance@peopledesk-test.com',
      `Direct MongoDB Atlas query confirmed document exists`
    );

    // 20. DELETE /api/employees/:id
    const deleteRes = await fetch(`${BASE_URL}/employees/${createdEmp1Id}`, {
      method: 'DELETE',
    });
    const deleteData = await deleteRes.json();
    recordTest(
      'DELETE /api/employees/:id (Delete Employee)',
      deleteRes.status === 200 && deleteData.success === true,
      `Status: ${deleteRes.status}, Deleted ID: ${deleteData.data?.id}`
    );

    // 21. DELETE /api/employees/:id on already deleted (404 test)
    const deleteNotFoundRes = await fetch(`${BASE_URL}/employees/${createdEmp1Id}`, {
      method: 'DELETE',
    });
    recordTest(
      'DELETE /api/employees/:id (Already Deleted 404)',
      deleteNotFoundRes.status === 404,
      `Status: ${deleteNotFoundRes.status}`
    );

    // Clean up remaining test employees
    await Employee.deleteMany({ email: /@peopledesk-test\.com$/ });
    console.log('\n[Cleanup] Test records cleaned up successfully.');

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.close();
    console.log('[Test Server] Stopped and MongoDB connection closed.\n');
  }

  // Summary
  const passedCount = testResults.filter((t) => t.passed).length;
  const failedCount = testResults.filter((t) => !t.passed).length;
  console.log('======================================================');
  console.log(`📊 Test Summary: ${passedCount} Passed, ${failedCount} Failed (Total: ${testResults.length})`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
};

runSuite();
