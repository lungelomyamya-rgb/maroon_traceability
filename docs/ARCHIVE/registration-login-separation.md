# Registration and Login Separation

## Overview

The registration and login systems have been separated to provide better user experience and clearer architecture:

## Registration System

### **Real-Only Registration**
- Registration now **only** uses the real Supabase adapter
- **No mock fallback** - registration requires real database connection
- Ensures data integrity and proper user account creation

### **Key Changes**
1. **Removed MockRegistrationAdapter** from registration flow
2. **Updated RegistrationRepository** to only use SupabaseRegistrationAdapter
3. **Removed fallback logic** - if Supabase fails, registration fails with clear error
4. **Updated hybrid configuration** to forbid fallback for registration

### **Error Handling**
If Supabase is not configured, registration will fail with:
```
Registration initialization failed. Supabase configuration required
```

## Login System

### **Dual-Mode Login**
Login supports both real authentication and demo accounts:

1. **Demo Accounts**: For testing and demonstration
2. **Real Authentication**: For production users with Supabase

### **Demo Accounts**
Available demo accounts (using `@mock.test` domain):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mock.test | admin123 |
| Farmer | farmer@mock.test | farmer123 |
| Inspector | inspector@mock.test | inspector123 |
| Retailer | retailer@mock.test | retailer123 |

### **Login Flow**
1. First checks if email/password match demo accounts
2. If not demo, attempts real authentication via Supabase
3. Provides clear error messages for invalid credentials

## Files Changed

### Registration Files
- `src/features/registration/services/RegistrationRepository.ts` - Removed mock fallback
- `src/core/utils/hybridUtils.ts` - Updated registration config
- MockRegistrationAdapter no longer used for registration

### Login Files  
- `src/features/auth/services/LoginService.ts` - NEW: Separate login service
- Demo accounts moved to `@mock.test` domain to avoid conflicts

### Configuration Files
- `src/config/adapters.ts` - Updated demo user emails
- `src/features/auth/application/DualAuthService.ts` - Updated demo emails

## Benefits

### **Registration**
- **Data Integrity**: Only real database storage
- **Clear Error Messages**: Users know when Supabase is needed
- **No Conflicts**: No mock data interfering with real emails

### **Login**
- **Flexible**: Supports both demo and real users
- **Clear Separation**: Demo accounts don't conflict with real emails
- **Better UX**: Different login experiences for different use cases

## Setup Requirements

### **For Registration to Work**
1. Configure Supabase in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Apply database schema from `database/schema.sql`

### **For Demo Login**
Demo accounts work out of the box - no setup required.

## Usage

### **Registration**
Users can register with any real email address (gmail.com, yahoo.com, etc.) and it will work properly without conflicts.

### **Login**
- Use demo accounts for testing: `admin@mock.test` / `admin123`
- Use real accounts after Supabase setup
- System automatically detects which type to use

## Migration Notes

- Existing demo accounts changed from `@demo.com` to `@mock.test`
- Registration no longer has any mock functionality
- Login is now handled by separate `LoginService` class
- Better error messages and user feedback
