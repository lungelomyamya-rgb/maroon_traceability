// src/lib/validation/inputFormatters.ts
// Tidies register-form input as it is typed, so number fields only ever hold the
// characters their format allows. The validation rules still run on blur and on Next.

// How many digits each digits-only field may hold
const DIGIT_LIMITS: Record<string, number> = {
  phone: 10,
  postalCode: 4,
  taxNumber: 10,
  vatNumber: 10,
};

/**
 * Remove everything except digits, then cut to maxDigits.
 */
export function keepDigits(value: string, maxDigits: number): string {
  return value.replace(/\D/g, '').slice(0, maxDigits);
}

/**
 * Format a CIPC registration number as it is typed: 201712345607 -> 2017/123456/07.
 */
export function formatRegistrationNumber(value: string): string {
  const digits = keepDigits(value, 12);
  if (digits.length <= 4) {
    return digits;
  }
  if (digits.length <= 10) {
    return `${digits.slice(0, 4)}/${digits.slice(4)}`;
  }
  return `${digits.slice(0, 4)}/${digits.slice(4, 10)}/${digits.slice(10)}`;
}

/**
 * Tidies a register-form value by field name. Fields without a rule are returned unchanged.
 */
export function formatRegisterInput(fieldName: string, value: string): string {
  if (fieldName === 'registrationNumber') {
    return formatRegistrationNumber(value);
  }
  const maxDigits = DIGIT_LIMITS[fieldName];
  return maxDigits === undefined ? value : keepDigits(value, maxDigits);
}
