import { registerSchema, loginSchema, validateInput } from '../utils/validation.js';

console.log('✅ Testing Validation Schemas...
');

// Test 1: Valid registration
try {
  const validReg = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!'
  };
  const result = validateInput(registerSchema, validReg);
  console.log('✅ TEST 1 PASSED: Valid registration data accepted');
} catch (e) {
  console.log('❌ TEST 1 FAILED:', e.message);
}

// Test 2: Weak password rejected
try {
  const weakPass = {
    name: 'John',
    email: 'john@example.com',
    password: 'weak'
  };
  validateInput(registerSchema, weakPass);
  console.log('❌ TEST 2 FAILED: Weak password should be rejected');
} catch (e) {
  console.log('✅ TEST 2 PASSED: Weak password rejected -', e.message.split('at')[0]);
}

// Test 3: Invalid email rejected
try {
  const badEmail = {
    name: 'John',
    email: 'not-an-email',
    password: 'SecurePass123!'
  };
  validateInput(registerSchema, badEmail);
  console.log('❌ TEST 3 FAILED: Invalid email should be rejected');
} catch (e) {
  console.log('✅ TEST 3 PASSED: Invalid email rejected');
}

// Test 4: Valid login
try {
  const validLogin = {
    email: 'test@example.com',
    password: 'TestPass123'
  };
  const result = validateInput(loginSchema, validLogin);
  console.log('✅ TEST 4 PASSED: Valid login data accepted');
} catch (e) {
  console.log('❌ TEST 4 FAILED:', e.message);
}

console.log('
✅ All validation tests complete!');
