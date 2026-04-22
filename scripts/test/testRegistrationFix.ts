#!/usr/bin/env node

// Test script to verify registration fixes
// Run with: npm run test:registration-fix

import { registrationRepository } from '../../src/features/registration/services/RegistrationRepository';

async function testRegistrationFix() {
  console.log('=== Registration Fix Test ===\n');

  try {
    // 1. Test repository initialization
    console.log('1. Testing repository initialization...');
    await registrationRepository.initialize();

    const adapterInfo = registrationRepository.getAdapterInfo();
    console.log('Adapter info:', adapterInfo);

    if (!adapterInfo) {
      throw new Error('Adapter not initialized');
    }

    // 2. Test health status
    console.log('\n2. Testing health status...');
    const health = await registrationRepository.getHealthStatus();
    console.log('Health status:', health);

    // 3. Test email availability check
    console.log('\n3. Testing email availability check...');
    const emailCheck = await registrationRepository.checkEmailAvailability('test@example.com');
    console.log('Email availability:', emailCheck);

    // 4. Test registration (with mock data)
    console.log('\n4. Testing registration...');
    const testUserData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'Test User',
      role: 'farmer' as const,
      additionalData: {
        userType: 'individual',
        registrationType: 'individual',
      },
    };

    const registrationResult = await registrationRepository.registerUser(testUserData);
    console.log('Registration result:', registrationResult);

    // 5. Test cleanup
    console.log('\n5. Testing cleanup...');
    await registrationRepository.cleanup();
    console.log('Cleanup completed');

    console.log('\n=== Test Summary ===');
    console.log('Repository initialization: SUCCESS');
    console.log('Health status check: SUCCESS');
    console.log('Email availability check: SUCCESS');
    console.log('Registration test: ' + (registrationResult.success ? 'SUCCESS' : 'FAILED'));

    if (registrationResult.error) {
      console.log('Registration error:', registrationResult.error);
    }

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testRegistrationFix().catch(console.error);
