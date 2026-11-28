// tests/unit/registerSchemas.test.ts
// Each register step schema gives the same errors the register pages show today

import { describe, expect, it } from '@jest/globals';
import { z } from 'zod';
import {
  commercialStep1Schema,
  commercialStep2Schema,
  getFieldErrors,
  individualStep1Schema,
  individualStep2Schema,
  retailerStep1Schema,
  smmeStep1Schema,
  smmeStep2Schema,
} from '@/lib/validation/registerSchemas';

// Values shared by several steps
const validAddress = {
  address: '12 Main Road',
  city: 'Durban',
  province: 'KwaZulu-Natal',
  postalCode: '4001',
};

const emptyAddressErrors = {
  address: 'Address is required',
  city: 'City is required',
  province: 'Please select a province',
  postalCode: 'Postal code is required',
};

const validIndividualStep1 = {
  firstName: 'Thandi',
  lastName: "O'Neil-Dlamini",
  email: 'thandi@example.com',
  phone: '0712345678',
  role: 'farmer',
};

const validCompanyDetails = {
  companyName: 'Green Valley Co-op',
  registrationNumber: '2022/123456/07',
  taxNumber: '1234567890',
  contactPerson: 'Sipho Ndlovu',
  email: 'info@example.com',
  phone: '0312345678',
  role: 'farmer',
};

const emptyCompanyErrors = {
  companyName: 'Company name is required',
  registrationNumber: 'Registration number is required',
  taxNumber: 'Tax number is required',
  contactPerson: 'Contact person is required',
  email: 'Email is required',
  phone: 'Phone number is required',
  role: 'Please select a role',
};

const validCommercialStep1 = {
  ...validCompanyDetails,
  vatNumber: '4123456789',
  numberOfEmployees: '51-200',
};

// One row per form step: Values that pass, and the message for each field left empty
type stepCase = {
  stepName: string;
  schema: z.ZodType;
  validValues: Record<string, string>;
  emptyFieldErrors: Record<string, string>;
};

const stepCases: stepCase[] = [
  {
    stepName: 'individual step 1',
    schema: individualStep1Schema,
    validValues: validIndividualStep1,
    emptyFieldErrors: {
      firstName: 'First name is required',
      lastName: 'Last name is required',
      email: 'Email is required',
      phone: 'Phone number is required',
      role: 'Please select a role',
    },
  },
  {
    stepName: 'individual step 2',
    schema: individualStep2Schema,
    validValues: validAddress,
    emptyFieldErrors: emptyAddressErrors,
  },
  {
    stepName: 'individual step 2',
    schema: individualStep2Schema,
    validValues: validAddress,
    emptyFieldErrors: emptyAddressErrors,
  },
  {
    stepName: 'SMME step 1',
    schema: smmeStep1Schema,
    validValues: validCompanyDetails,
    emptyFieldErrors: emptyCompanyErrors,
  },
  {
    stepName: 'SMME step 2',
    schema: smmeStep2Schema,
    validValues: { ...validAddress, numberOfMembers: '11-50', businessType: 'cooperative' },
    emptyFieldErrors: {
      ...emptyAddressErrors,
      numberOfMembers: 'Please select number of members',
      businessType: 'Please select business type',
    },
  },
  {
    stepName: 'commercial step 1',
    schema: commercialStep1Schema,
    validValues: validCommercialStep1,
    // No vatNumber here: VAT is optional, so leaving it empty is not an error
    emptyFieldErrors: {
      ...emptyCompanyErrors,
      numberOfEmployees: 'Please select number of employees',
    },
  },
  {
    stepName: 'commercial step 2',
    schema: commercialStep2Schema,
    validValues: { ...validAddress, annualRevenue: '1m-5m', businessType: 'commercial' },
    emptyFieldErrors: {
      ...emptyAddressErrors,
      annualRevenue: 'Please select annual revenue',
      businessType: 'Please select business type',
    },
  },
  {
    stepName: 'retailer step 1',
    schema: retailerStep1Schema,
    validValues: {
      companyName: 'Fresh Market',
      registrationNumber: '2019/654321/07',
      email: 'orders@example.com',
      phone: '0211234567',
      role: 'retailer',
      address: '5 Long Street',
      city: 'Cape Town',
      country: 'South Africa',
      postalCode: '8001',
    },
    emptyFieldErrors: {
      companyName: 'Company name is required',
      registrationNumber: 'Registration number is required',
      email: 'Email is required',
      phone: 'Phone number is required',
      role: 'Please select a role',
      address: 'Address is required',
      city: 'City is required',
      country: 'Country is required',
      postalCode: 'Postal code is required',
    },
  },
];

describe('registerSchemas', () => {
  describe.each(stepCases)('$stepName', ({ schema, validValues, emptyFieldErrors }) => {
    it('returns no errors for valid values', () => {
      expect(getFieldErrors(schema, validValues)).toEqual({});
    });

    it('returns the page message for every empty field', () => {
      const emptyValues = Object.fromEntries(
        Object.keys(validValues).map((fieldName) => [fieldName, ''])
      );
      expect(getFieldErrors(schema, emptyValues)).toEqual(emptyFieldErrors);
    });

    it('ignores fields from other steps', () => {
      const wholeForm = { ...validValues, password: 'Secret123', agreeToTerms: 'true' };
      expect(getFieldErrors(schema, wholeForm)).toEqual({});
    });
  });

  describe('format messages (commercial step 1)', () => {
    it.each([
      ['email', 'not-an-email', 'Please enter a valid email address'],
      [
        'phone',
        '071234567',
        'Please enter a 10-digit phone number starting with 0, e.g. 0712345678',
      ],
      [
        'phone',
        '7123456789',
        'Please enter a 10-digit phone number starting with 0, e.g. 0712345678',
      ],
      [
        'registrationNumber',
        '2022/12345/01',
        'Please enter a valid registration number (format: YYYY/NNNNNN/NN, e.g. 2022/123456/01)',
      ],
      ['taxNumber', '123456789', 'Please enter a valid tax number (10 digits)'],
      ['vatNumber', '5123456789', 'Please enter a valid VAT number (10 digits starting with 4)'],
      [
        'contactPerson',
        '0712345678',
        'Contact person can only contain letters, spaces, apostrophes and hyphens',
      ],
    ])('%s "%s" -> "%s"', (fieldName, badValue, expectedMessage) => {
      const values = { ...validCommercialStep1, [fieldName]: badValue };
      expect(getFieldErrors(commercialStep1Schema, values)).toEqual({
        [fieldName]: expectedMessage,
      });
    });
  });

  it.each(['400', '40a1'])('rejects postal code "%s"', (postalCode) => {
    const values = { ...validAddress, postalCode };
    expect(getFieldErrors(individualStep2Schema, values)).toEqual({
      postalCode: 'Please enter a 4-digit postal code',
    });
  });

  it('rejects numbers in a first name', () => {
    const values = { ...validIndividualStep1, firstName: 'Thandi2' };
    expect(getFieldErrors(individualStep1Schema, values)).toEqual({
      firstName: 'First name can only contain letters, spaces, apostrophes and hyphens',
    });
  });

  it('reports fields that are missing entirely', () => {
    const fieldNames = Object.keys(getFieldErrors(individualStep2Schema, {})).sort();
    expect(fieldNames).toEqual(['address', 'city', 'postalCode', 'province']);
  });
});
