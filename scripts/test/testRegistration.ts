/**
 * Registration Test Runner
 * Quick test script to verify registration functionality
 */

// Import the repository directly for testing
import { registrationRepository } from '../../src/features/registration/services/RegistrationRepository.js';

async function runRegistrationTests() {
  console.log('=== Registration System Tests ===\n');

  try {
    // Test 1: Initialize repository
    console.log('1. Testing repository initialization...');
    await registrationRepository.initialize();
    const adapterInfo = registrationRepository.getAdapterInfo();
    console.log(`   Adapter: ${adapterInfo?.type} (${adapterInfo?.id})`);
    console.log('   Initialization: PASSED\n');

    // Test 2: Check email availability
    console.log('2. Testing email availability check...');
    const emailCheck = await registrationRepository.checkEmailAvailability('test-runner@example.com');
    console.log(`   Email available: ${emailCheck.data}`);
    console.log(`   Status: ${emailCheck.success ? 'PASSED' : 'FAILED'}\n`);

    // Test 3: Test registration validation
    console.log('3. Testing registration validation...');
    const invalidRegistration = await registrationRepository.registerUser({
      email: '',
      password: 'weak',
      name: '',
      role: 'farmer',
    });
    console.log(`   Validation caught errors: ${!invalidRegistration.success}`);
    console.log(`   Status: ${invalidRegistration.success ? 'FAILED (should fail)' : 'PASSED'}\n`);

    // Test 4: Test valid registration
    console.log('4. Testing valid user registration...');
    const validRegistration = await registrationRepository.registerUser({
      email: 'test-runner@example.com',
      password: 'SecurePassword123!',
      name: 'Test Runner',
      role: 'farmer',
    });
    console.log(`   Registration success: ${validRegistration.success}`);
    if (validRegistration.success) {
      console.log(`   User ID: ${validRegistration.data?.id}`);
      console.log(`   User Email: ${validRegistration.data?.email}`);
    }
    console.log(`   Status: ${validRegistration.success ? 'PASSED' : 'FAILED'}\n`);

    // Test 5: Test duplicate registration
    console.log('5. Testing duplicate registration...');
    const duplicateRegistration = await registrationRepository.registerUser({
      email: 'test-runner@example.com', // Same email
      password: 'SecurePassword123!',
      name: 'Test Runner Duplicate',
      role: 'farmer',
    });
    console.log(`   Duplicate rejected: ${!duplicateRegistration.success}`);
    console.log(`   Status: ${!duplicateRegistration.success ? 'PASSED' : 'FAILED'}\n`);

    // Test 6: Test email verification
    console.log('6. Testing email verification...');
    const verificationResult = await registrationRepository.verifyEmail('mock-token');
    console.log(`   Verification success: ${verificationResult.success}`);
    console.log(`   Status: ${verificationResult.success ? 'PASSED' : 'FAILED'}\n`);

    // Test 7: Health check
    console.log('7. Testing health status...');
    const health = await registrationRepository.getHealthStatus();
    console.log(`   Health status: ${health.status}`);
    console.log(`   Response time: ${health.details.responseTime}ms`);
    console.log(`   Status: ${health.status === 'healthy' ? 'PASSED' : 'FAILED'}\n`);

    // Test 8: Cache operations
    console.log('8. Testing cache operations...');
    const cacheStats = registrationRepository.getCacheStats();
    console.log(`   Cache size: ${cacheStats.size}`);
    console.log(`   Cache keys: ${cacheStats.keys.length}`);
    console.log('   Status: PASSED\n');

    console.log('=== Test Summary ===');
    console.log('All basic registration tests completed!');

    // Cleanup
    await registrationRepository.cleanup();
    console.log('Repository cleaned up successfully.');

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the tests
runRegistrationTests().catch(console.error);
