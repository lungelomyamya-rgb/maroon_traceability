// tests/unit/registrationValidation.test.ts
// Format rules for the South African fields on the register forms

import { RegistrationValidation } from '@/lib/validation/registrationValidation';
import { it, expect, describe } from '@jest/globals';

describe('RegistrationValidation', () => {
  describe('validatePhone', () => {
    it.each(['0712345678', '071 234 5678', '(071) 234-5678', '+27 71 234 5678', '+27712345678'])(
      'accepts %s',
      (phone) => {
        expect(RegistrationValidation.validatePhone(phone)).toBeNull();
      }
    );

    it.each(['', '071234567', '97060064656', '0743335344354545454', '+44 20 7946 0958', '071-ABC-5678'])(
      'rejects "%s"',
      (phone) => {
        expect(RegistrationValidation.validatePhone(phone)).not.toBeNull();
      }
    );
  });

  describe('validatePersonName', () => {
    it.each(['Thandi Nkosi', "O'Brien", 'Jean-Luc', 'Zoë Dlamini', 'J. Smith', 'Thandi'])(
      'accepts "%s"',
      (name) => {
        expect(RegistrationValidation.validatePersonName(name, 'Contact person')).toBeNull();
      }
    );

    it.each(['', ' ', '071 234 567844', 'Thandi2', '-Thandi', '@@@'])(
      'rejects "%s"',
      (name) => {
        expect(RegistrationValidation.validatePersonName(name, 'Contact person')).not.toBeNull();
      }
    );

    it('names the field in the required message', () => {
      expect(RegistrationValidation.validatePersonName('', 'Contact person')).toBe(
        'Contact person is required'
      );
    });
  });

  describe('validatePostalCode', () => {
    it.each(['0001', '4001', '5410', '8001', ' 2000 '])(
      'accepts "%s"', 
      (postalCode) => {
        expect(RegistrationValidation.validatePostalCode(postalCode)).toBeNull();
      }
    );

    it.each(['', '  ', '001', '40011', '40 01', 'ABC', 'SW1A 1AA', '4001-'])(
      'rejects "%s"',
      (postalCode) => {
        expect(RegistrationValidation.validatePostalCode(postalCode)).not.toBeNull();
      }
    );
  });

  describe('validateRegistrationNumber', () => {
    it.each(['2017/123456/07', ' 2017/123456/07 '])(
      'accepts "%s"', (registrationNumber) => {
      expect(RegistrationValidation.validateRegistrationNumber(registrationNumber)).toBeNull();
    });

    it.each(['', '2017/1234/07', '2017/123456/7', '2017-123456-07', '201712345607'])(
      'rejects "%s"',
      (registrationNumber) => {
        expect(RegistrationValidation.validateRegistrationNumber(registrationNumber)).not.toBeNull();
      }
    );
  });

  describe('validateTaxNumber', () => {
    it.each(['0987898777', '0987 898 777', ''])(
      'accepts "%s"', 
      (taxNumber) => {
      expect(RegistrationValidation.validateTaxNumber(taxNumber)).toBeNull();
    });

    it.each(['098789877779', '098789877', '09878987AB'])(
      'rejects "%s"', 
      (taxNumber) => {
      expect(RegistrationValidation.validateTaxNumber(taxNumber)).not.toBeNull();
    });
  });

  describe('validateVATNumber', () => {
    it.each(['4123456789', '4123 456 789', ''])(
      'accepts "%s"', 
      (vatNumber) => {
      expect(RegistrationValidation.validateVATNumber(vatNumber)).toBeNull();
    });

    it.each(['1234', '5123456789', '412345678', '41234567890'])(
      'rejects "%s"', 
      (vatNumber) => {
      expect(RegistrationValidation.validateVATNumber(vatNumber)).not.toBeNull();
    });
  });
});
