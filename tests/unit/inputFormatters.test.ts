// test/unit/inputFormatters.test.ts
// What the register number fields keep while the user types or pastes

import { describe, expect, it } from '@jest/globals';
import {
  formatRegisterInput,
  formatRegistrationNumber,
  keepDigits,
} from '@/lib/validation/inputFormatters';
import { Value } from '@radix-ui/react-select';

describe('inputFormatters', () => {
  describe('keepDigits', () => {
    it.each([
      ['071 234 5678', 10, '0712345678'],
      ['+27 71 234 5678', 10, '2771234567'],
      ['40a01', 4, '4001'],
      ['400199', 4, '4001'],
      ['', 4, ''],
    ])('keepDigits("%s", %i) -> "%s"', (value, maxDigits, expected) => {
      expect(keepDigits(value, maxDigits)).toBe(expected);
    });
  });

  describe('formatRegistrationNumber', () => {
    it.each([
      ['2', '2'],
      ['2017', '2017'],
      ['20171', '2017/1'],
      ['2017123456', '2017/123456'],
      ['20171234560', '2017/123456/0'],
      ['201712345607', '2017/123456/07'],
      ['2017/123456/07', '2017/123456/07'],
      ['2017-123456-07', '2017/123456/07'],
      ['2017123456079', '2017/123456/07'],
      ['', ''],
    ])('"%s" -> "%s"', (value, expected) => {
      expect(formatRegistrationNumber(value)).toBe(expected);
    });
  });

  describe('formatRegisterInput', () => {
    it.each([
      ['phone', '071 234 56789', '0712345678'],
      ['postalCode', '4001x', '4001'],
      ['taxNumber', '0987 898 7775', '0987898777'],
      ['vatNumber', '4123-456-789', '4123456789'],
      ['registrationNumber', '201712345607', '2017/123456/07'],
      ['companyName', 'Acme 123 (Pty) Ltd', 'Acme 123 (Pty) Ltd'],
      ['email', 'a.b@example.com', 'a.b@example.com'],
    ])('"%s: "%s" -> "%s"', (fieldName, value, expected) => {
      expect(formatRegisterInput(fieldName, value)).toBe(expected);
    });
  });
});
