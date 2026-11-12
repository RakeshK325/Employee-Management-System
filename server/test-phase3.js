import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes/api.js';
import { notFound } from './src/middleware/notFound.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
let serverInstance = null;
let API_BASE = 'http://localhost:5000/api';

const results = [];
const logTest = (name, ok, details = '') => {
  results.push({ name, ok, details });
  console.log(`${ok ? '✅' : '❌'} ${name} ${details ? '— ' + details : ''}`);
};

const runVerification = async () => {
  console.log('\n======================================================');
  console.log('🧪 Running Phase 3 Frontend-Backend Integration Verification');
  console.log('======================================================\n');

  // Check if live server is reachable on port 5000
  let isLiveServerRunning = false;
  try {
    const probe = await fetch('http://localhost:5000/api/health', { signal: AbortSignal.timeout(1500) });
    if (probe.ok) isLiveServerRunning = true;
  } catch {
    isLiveServerRunning = false;
  }

  if (!isLiveServerRunning) {
    console.log('[Test Setup] Port 5000 is idle. Initializing ephemeral test server on port 5098...');
    await mongoose.connect(uri);

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api', apiRoutes);
    app.use(notFound);
    app.use(errorHandler);

    serverInstance = await new Promise((resolve) => {
      const s = app.listen(5098, () => resolve(s));
    });
    API_BASE = 'http://localhost:5098/api';
    console.log(`[Test Setup] Ephemeral test server active on ${API_BASE}\n`);
  } else {
    console.log(`[Test Setup] Live PeopleDesk server detected on ${API_BASE}\n`);
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    logTest('API Health & Atlas Connection', health.status === 'healthy' && health.database === 'connected', `Database: ${health.database}`);

    // 2. Initial List
    const initialListRes = await fetch(`${API_BASE}/employees`);
    const initialList = await initialListRes.json();
    logTest('Fetch Initial Employee Directory', initialList.success === true, `Existing count: ${initialList.count}`);

    // Clean up any old test records
    if (initialList.data) {
      for (const emp of initialList.data) {
        if (emp.email.endsWith('@peopledesk-p3.test')) {
          await fetch(`${API_BASE}/employees/${emp._id}`, { method: 'DELETE' });
        }
      }
    }

    // 3. Create Employee (Simulating Add Employee Form submission)
    const newEmpRes = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'David Sterling',
        email: 'd.sterling@peopledesk-p3.test',
        department: 'Engineering',
        designation: 'Principal Security Architect',
        status: 'Active',
      }),
    });
    const newEmp = await newEmpRes.json();
    const createdId = newEmp.data?._id;
    logTest('Create Employee via Modal Form', newEmp.success === true && newEmp.data?.fullName === 'David Sterling', `ID: ${createdId}`);

    // 4. Duplicate Email Validation
    const dupRes = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Another David',
        email: 'd.sterling@peopledesk-p3.test',
        department: 'Operations',
        designation: 'Security Consultant',
      }),
    });
    const dupData = await dupRes.json();
    logTest('Duplicate Email Rejection', dupRes.status === 400 && dupData.success === false, `Message: "${dupData.message}"`);

    // 5. Create Second Employee for filtering & status testing
    const newEmp2Res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Elena Rostova',
        email: 'e.rostova@peopledesk-p3.test',
        department: 'Product Design',
        designation: 'Senior Product Designer',
        status: 'Active',
      }),
    });
    const newEmp2 = await newEmp2Res.json();
    const createdId2 = newEmp2.data?._id;
    logTest('Create Second Employee for Directory', newEmp2.success === true, `ID: ${createdId2}`);

    // 6. Edit Employee (Simulating Edit Employee Form submission)
    const updateRes = await fetch(`${API_BASE}/employees/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'David Sterling PhD',
        designation: 'VP of Security Architecture',
      }),
    });
    const updatedEmp = await updateRes.json();
    logTest('Edit Employee Record', updateRes.status === 200 && updatedEmp.data?.fullName === 'David Sterling PhD' && updatedEmp.data?.designation === 'VP of Security Architecture', `New title: ${updatedEmp.data?.designation}`);

    // 7. Status Toggle (Simulating StatusBadge interactive click)
    const statusRes = await fetch(`${API_BASE}/employees/${createdId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Inactive' }),
    });
    const statusUpdate = await statusRes.json();
    logTest('Update Status via StatusBadge', statusRes.status === 200 && statusUpdate.data?.status === 'Inactive', `New status: ${statusUpdate.data?.status}`);

    // 8. Search Filter by Name
    const searchRes = await fetch(`${API_BASE}/employees?search=Sterling`);
    const searchData = await searchRes.json();
    logTest('Search Employees by Name', searchRes.status === 200 && searchData.data?.length > 0 && searchData.data[0].fullName.includes('Sterling'), `Matches: ${searchData.data?.length}`);

    // 9. Department Filter
    const deptRes = await fetch(`${API_BASE}/employees?department=Product%20Design`);
    const deptData = await deptRes.json();
    logTest('Filter Employees by Department', deptRes.status === 200 && deptData.data?.every((e) => e.department === 'Product Design'), `Matches: ${deptData.data?.length}`);

    // 10. Status Filter
    const statusFilterRes = await fetch(`${API_BASE}/employees?status=Inactive`);
    const statusFilterData = await statusFilterRes.json();
    logTest('Filter Employees by Status', statusFilterRes.status === 200 && statusFilterData.data?.some((e) => e._id === createdId), `Inactive count: ${statusFilterData.data?.length}`);

    // 11. Pagination Test
    const pageRes = await fetch(`${API_BASE}/employees?page=1&limit=1`);
    const pageData = await pageRes.json();
    logTest('Backend Pagination Query Support', pageRes.status === 200 && pageData.data?.length === 1 && pageData.pagination?.limit === 1, `Page 1 of ${pageData.pagination?.totalPages}`);

    // 12. Delete Employee (Simulating Delete Confirmation modal)
    const deleteRes = await fetch(`${API_BASE}/employees/${createdId}`, {
      method: 'DELETE',
    });
    const deleteData = await deleteRes.json();
    logTest('Delete Employee via Confirmation Modal', deleteRes.status === 200 && deleteData.success === true, `Deleted ID: ${deleteData.data?.id}`);

    // 13. Verify Deletion in MongoDB Atlas
    const notFoundRes = await fetch(`${API_BASE}/employees/${createdId}`);
    logTest('Verify Record Removed from Database', notFoundRes.status === 404, 'Confirmed 404 response on deleted ID');

    // Clean up second test employee
    await fetch(`${API_BASE}/employees/${createdId2}`, { method: 'DELETE' });
    console.log('\n[Cleanup] Test records cleaned up.');

  } catch (err) {
    console.error('Test error:', err);
    logTest('Unexpected Test Suite Error', false, err.message);
  } finally {
    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(resolve));
      await mongoose.connection.close();
      console.log('[Test Setup] Ephemeral test server closed.');
    }
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log('\n======================================================');
  console.log(`📊 Phase 3 Verification Summary: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
};

runVerification();
