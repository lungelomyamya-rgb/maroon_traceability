// src/lib/validation/registerSchemas.ts
// One schema per register-form step. Each field reuses an existing RegistrationValidation
// rule, so messages match the forms exactly. Pages (and later the server) check their
// data against these schemas instead of repeating the rules.

import { z } from 'zod';
import { RegistrationValidation } from '@/lib/validation/registrationValidation';

// A rule takes the field's text and returns an error message, or null when it is valid
type FieldRule = (value: string) => string | null;

/**
 * Turn a rule into a zod string field that reports the rule's message.
 */
function fromRule(rule: FieldRule) {
  return z.string().superRefine((value, context) => {
    const message = rule(value);
    if (message) {
      context.addIssue({ code: 'custom', message });
    }
  });
}

/**
 * Rule for a text box or drop-down that must not be left empty.
 */
function required(message: string): FieldRule {
  return (value) => (value.trim() ? null : message);
}

// Fields shared by several forms
const emailField = fromRule((value) => RegistrationValidation.validateEmail(value));
const phoneField = fromRule((value) => RegistrationValidation.validatePhone(value));
const postalCodeField = fromRule((value) => RegistrationValidation.validatePostalCode(value));
const roleField = fromRule(required('Please select a role'));
const companyNameField = fromRule(required('Company name is required'));
const registrationNumberField = fromRule((value) =>
  RegistrationValidation.validateRegistrationNumber(value));
const contactPersonField = fromRule((value) =>
  RegistrationValidation.validatePersonName(value, 'Contact person'));
const addressField = fromRule(required('Address is required'));
const cityField = fromRule(required('City is required'));
const provinceField = fromRule(required('Please select a province'));
const businessTypeField = fromRule(required('Please select business type'));

// Tax number is required on the SMME and commercial forms
const requiredTaxNumberField = fromRule((value) =>
  value.trim() ? RegistrationValidation.validateTaxNumber(value) : 'Tax number is required');

// Individual farmer
export const individualStep1Schema = z.object({
  firstName: fromRule((value) => RegistrationValidation.validatePersonName(value, 'First name')),
  lastName: fromRule((value) => RegistrationValidation.validatePersonName(value, 'Last name')),
  email: emailField,
  phone: phoneField,
  role: roleField,
});

export const individualStep2Schema = z.object({
  address: addressField,
  city: cityField,
  province: provinceField,
  postalCode: postalCodeField,
});

// SMME / co-op
export const smmeStep1Schema = z.object({
  companyName: companyNameField,
  registrationNumber: registrationNumberField,
  taxNumber: requiredTaxNumberField,
  contactPerson: contactPersonField,
  email: emailField,
  phone: phoneField,
  role: roleField,
});

export const smmeStep2Schema = z.object({
  address: addressField,
  city: cityField,
  province: provinceField,
  postalCode: postalCodeField,
  numberOfMembers: fromRule(required('Please select number of members')),
  businessType: businessTypeField,
});

// Commercial farmer
export const commercialStep1Schema = z.object({
  companyName: companyNameField,
  registrationNumber: registrationNumberField,
  taxNumber: requiredTaxNumberField,
  vatNumber: fromRule((value) => RegistrationValidation.validateVATNumber(value)),
  contactPerson: contactPersonField,
  email: emailField,
  phone: phoneField,
  role: roleField,
  numberOfEmployees: fromRule(required('Please select number of employees')),
});

export const commercialStep2Schema = z.object({
  annualRevenue: fromRule(required('Please select annual revenue')),
  businessType: businessTypeField,
  address: addressField,
  city: cityField,
  province: provinceField,
  postalCode: postalCodeField,
});

// Retailer: Every checked field is on step 1
export const retailerStep1Schema = z.object({
  companyName: companyNameField,
  registrationNumber: registrationNumberField,
  email: emailField,
  phone: phoneField,
  role: roleField,
  address: addressField,
  city: cityField,
  country: fromRule(required('Country is required')),
  postalCode: postalCodeField,
});

/**
 * Check values against a schema and return { fieldName: message } for each failing field.
 * Returns an empty object when everything is valid. Extra fields in values are ignored.
 */
export function getFieldErrors(schema: z.ZodType, values: unknown): Record<string, string> {
  const result = schema.safeParse(values);
  if (result.success) {
    return {};
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const fieldName = String(issue.path[0] ?? '');
    if (fieldName && !errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  }
  return errors;
}
