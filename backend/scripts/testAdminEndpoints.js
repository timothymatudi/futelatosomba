// Script to test admin endpoints
require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const token = process.argv[2];

if (!token) {
  console.log('\n=== Admin Endpoints Test Script ===\n');
  console.log('Usage: node scripts/testAdminEndpoints.js <admin-jwt-token>\n');
  console.log('First, login as admin to get your token:');
  console.log('  POST /api/auth/login');
  console.log('  Body: { "email": "admin@futelatosomba.com", "password": "your-password" }\n');
  console.log('Then run:');
  console.log('  node scripts/testAdminEndpoints.js YOUR_TOKEN\n');
  process.exit(1);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'x-auth-token': token
  }
});

const testEndpoint = async (method, endpoint, data = null, description) => {
  try {
    console.log(`\n🔵 Testing: ${description}`);
    console.log(`   ${method} ${endpoint}`);

    let response;
    if (method === 'GET') {
      response = await api.get(endpoint);
    } else if (method === 'POST') {
      response = await api.post(endpoint, data);
    } else if (method === 'PUT') {
      response = await api.put(endpoint, data);
    } else if (method === 'DELETE') {
      response = await api.delete(endpoint);
    }

    console.log(`   ✅ Success (${response.status})`);
    if (response.data) {
      if (response.data.success !== undefined) {
        console.log(`   Success: ${response.data.success}`);
      }
      if (response.data.msg) {
        console.log(`   Message: ${response.data.msg}`);
      }
    }
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      console.log(`   ❌ Failed (${error.response.status})`);
      console.log(`   Error: ${error.response.data?.msg || error.response.data?.error || 'Unknown error'}`);
    } else {
      console.log(`   ❌ Failed: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
};

const runTests = async () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   Admin Panel Endpoints Test                  ║');
  console.log('╚════════════════════════════════════════════════╝');

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: Dashboard Stats
  let result = await testEndpoint('GET', '/admin/stats', null, 'Get Dashboard Statistics');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 2: Get Properties
  result = await testEndpoint('GET', '/admin/properties?page=1&limit=10', null, 'Get All Properties');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 3: Get Pending Properties
  result = await testEndpoint('GET', '/admin/properties?status=pending', null, 'Get Pending Properties');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 4: Get Users
  result = await testEndpoint('GET', '/admin/users?page=1&limit=10', null, 'Get All Users');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 5: Get Users by Role
  result = await testEndpoint('GET', '/admin/users?role=agent', null, 'Get Agent Users');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 6: Get Transactions
  result = await testEndpoint('GET', '/admin/transactions?page=1&limit=10', null, 'Get All Transactions');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 7: Get Successful Transactions
  result = await testEndpoint('GET', '/admin/transactions?status=succeeded', null, 'Get Successful Transactions');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 8: Get Donations
  result = await testEndpoint('GET', '/admin/donations?page=1&limit=10', null, 'Get All Donations');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 9: Get Successful Donations
  result = await testEndpoint('GET', '/admin/donations?status=succeeded', null, 'Get Successful Donations');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 10: Get Activity Log
  result = await testEndpoint('GET', '/admin/activity-log', null, 'Get Activity Log');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 11: Search Properties
  result = await testEndpoint('GET', '/admin/properties?search=villa', null, 'Search Properties');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 12: Search Users
  result = await testEndpoint('GET', '/admin/users?search=john', null, 'Search Users');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 13: Filter Transactions by Date
  const startDate = new Date('2025-01-01').toISOString();
  const endDate = new Date().toISOString();
  result = await testEndpoint('GET', `/admin/transactions?startDate=${startDate}&endDate=${endDate}`, null, 'Filter Transactions by Date');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 14: Sort Properties
  result = await testEndpoint('GET', '/admin/properties?sortBy=views&sortOrder=desc', null, 'Sort Properties by Views');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Test 15: Get Properties by Type
  result = await testEndpoint('GET', '/admin/properties?propertyType=House', null, 'Get House Properties');
  results.total++;
  result.success ? results.passed++ : results.failed++;

  // Print Summary
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   Test Results Summary                         ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`   Total Tests:   ${results.total}`);
  console.log(`   ✅ Passed:      ${results.passed}`);
  console.log(`   ❌ Failed:      ${results.failed}`);
  console.log(`   Success Rate:  ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

  if (results.failed === 0) {
    console.log('   🎉 All tests passed!\n');
  } else {
    console.log('   ⚠️  Some tests failed. Check the output above for details.\n');
  }

  // Additional Info
  console.log('\n📝 Note: The following endpoints were not tested automatically:');
  console.log('   - PUT /admin/properties/:id/approve (requires property ID)');
  console.log('   - PUT /admin/properties/:id/reject (requires property ID)');
  console.log('   - DELETE /admin/properties/:id (requires property ID)');
  console.log('   - GET /admin/users/:id (requires user ID)');
  console.log('   - PUT /admin/users/:id/role (requires user ID)');
  console.log('   - DELETE /admin/users/:id (requires user ID)');
  console.log('   - POST /admin/broadcast (requires message)\n');
  console.log('   These require specific IDs and should be tested manually.');
  console.log('   See ADMIN_PANEL_README.md for testing examples.\n');
};

runTests().catch(error => {
  console.error('\n❌ Test script failed:', error.message);
  process.exit(1);
});
