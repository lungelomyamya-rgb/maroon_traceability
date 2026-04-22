# Registration System Documentation

## Overview

The Maroon Traceability Demo includes a comprehensive registration system that supports multiple user types and integrates with Supabase for real database storage and authentication.

## Supported User Types

### 1. Individual Farmer
- **Target**: Small-scale farmers
- **Plan**: Free forever
- **Features**: 5 records/month, basic traceability
- **Registration Flow**: 3-step process (Personal Info, Farm Info, Security)

### 2. Commercial Farmer
- **Target**: Large-scale commercial operations
- **Plan**: R7,500/month (Professional)
- **Features**: 200 records/month, up to 200 users, API access
- **Registration Flow**: 3-step process (Business Info, Financial Details, Security)

### 3. SMME/Co-operative
- **Target**: Small to medium enterprises and cooperatives
- **Plan**: R950/month after 14-day trial (Professional)
- **Features**: 100 records/month, up to 5 users
- **Registration Flow**: 3-step process (Business Info, Location & Type, Security)

### 4. Retailer
- **Target**: Retail businesses and certification bodies
- **Plan**: Professional tier
- **Features**: Product certification, retail operations
- **Registration Flow**: 3-step process (Business Info, Documents, Security)

## Technical Architecture

### Frontend Components

```
app/register/
- individual/page.tsx          # Individual farmer registration
- commercial/page.tsx          # Commercial farmer registration
- smme/page.tsx               # SMME/Co-op registration
- retailer/page.tsx           # Retailer registration

src/features/registration/
- adapters/                     # Database adapters
  - SupabaseRegistrationAdapter.ts  # Supabase integration
  - MockRegistrationAdapter.ts      # Mock data for testing
- components/                   # UI components
  - RegistrationForm.tsx           # Reusable registration form
- hooks/                       # React hooks
  - useRegistration.ts              # Registration state management
- services/                    # Business logic
  - RegistrationRepository.ts       # Data access layer
- types/                      # TypeScript definitions
```

### Backend Integration

```
Supabase Database Tables:
- users                        # User profiles and metadata
- registration_attempts       # Registration tracking
- email_verification_tokens    # Email verification
- user_sessions              # Session management
```

## Registration Flow

### Step 1: Form Submission
1. User fills out registration form
2. Client-side validation
3. Email availability check
4. Form data submission to registration service

### Step 2: Account Creation
1. User created in Supabase Auth
2. User profile created in database
3. Email verification triggered
4. Registration attempt logged

### Step 3: Email Verification
1. Verification email sent to user
2. User clicks verification link
3. Email verified in database
4. Account activated

### Step 4: Login
1. User redirected to login page
2. Credentials verified with Supabase Auth
3. User session created
4. Access granted based on role

## Data Structure

### User Profile Schema

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'inspector' | 'logistics' | 'packaging' | 'retailer';
  userType: 'individual' | 'commercial' | 'smme' | 'retailer';
  registrationType: 'individual' | 'commercial' | 'smme' | 'retailer';
  
  // Business Information
  companyName?: string;
  registrationNumber?: string;
  taxNumber?: string;
  vatNumber?: string;
  contactPerson?: string;
  
  // Contact Information
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  
  // Farm/Business Details
  farmSize?: string;
  livestockType?: string;
  numberOfEmployees?: string;
  annualRevenue?: string;
  businessType?: string;
  numberOfMembers?: string;
  
  // Account Status
  isActive: boolean;
  emailVerified: boolean;
  isApproved: boolean;
  plan: 'basic' | 'professional' | 'enterprise';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  additionalData: Record<string, any>;
}
```

### Registration Data Schema

```typescript
interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: string;
  additionalData: {
    userType: string;
    registrationType: string;
    plan?: string;
    // ... other fields based on user type
  };
}
```

## Security Features

### Authentication
- **Password Requirements**: Minimum 8 characters, uppercase, lowercase, numbers
- **Email Verification**: Required for all registrations
- **Session Management**: Secure JWT tokens with expiration
- **Rate Limiting**: Prevents brute force attacks

### Data Protection
- **Input Validation**: Zod schemas for all input data
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure form submissions

### Privacy
- **Data Minimization**: Only collect necessary information
- **Consent Management**: Terms of service agreement required
- **Data Encryption**: Encrypted data transmission
- **GDPR Compliance**: Right to delete and export data

## Configuration

### Environment Variables

```bash
# Required for Supabase integration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Database Setup

1. Create Supabase project
2. Run the schema setup script (`database/schema.sql`)
3. Configure authentication settings
4. Set up email templates
5. Enable Row Level Security (RLS)

## Testing

### Unit Tests
```bash
# Run registration tests
npm test -- --testPathPattern=registration

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration

# Test specific user types
npm run test -- --testNamePattern="Individual Registration"
npm run test -- --testNamePattern="Commercial Registration"
npm run test -- --testNamePattern="SMME Registration"
npm run test -- --testNamePattern="Retailer Registration"
```

### Manual Testing
1. **Email Flow**: Test complete registration and email verification
2. **Validation**: Test form validation for all user types
3. **Error Handling**: Test error scenarios and edge cases
4. **Performance**: Test registration performance under load

## Error Handling

### Client-Side Errors
- **Network Errors**: Retry mechanism with exponential backoff
- **Validation Errors**: Real-time field validation
- **Server Errors**: User-friendly error messages
- **Timeout Errors**: Graceful degradation

### Server-Side Errors
- **Database Errors**: Proper error logging and monitoring
- **Email Errors**: Fallback email service
- **Authentication Errors**: Secure error messages
- **System Errors**: Health checks and monitoring

## Monitoring and Analytics

### Registration Metrics
- **Conversion Rate**: Registration completion percentage
- **Drop-off Points**: Where users abandon registration
- **Error Rates**: Registration failure rates
- **Performance**: Registration completion time

### User Analytics
- **User Type Distribution**: Breakdown by user type
- **Geographic Distribution**: User locations
- **Registration Trends**: Registration over time
- **Verification Rates**: Email verification completion

## Troubleshooting

### Common Issues

#### Registration Fails
- **Check**: Environment variables are set correctly
- **Check**: Supabase connection is working
- **Check**: Database schema is applied
- **Check**: RLS policies are configured

#### Email Not Received
- **Check**: Spam folder
- **Check**: Email address is correct
- **Check**: Supabase email settings
- **Check**: DNS configuration

#### Login Issues After Registration
- **Check**: Email is verified
- **Check**: User is marked as active
- **Check**: Password is correct
- **Check**: Session token is valid

### Debug Mode

Enable debug logging:
```bash
NEXT_PUBLIC_DEBUG=true npm run dev
```

Check browser console for detailed error messages and API responses.

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Lazy load registration components
- **Image Optimization**: Optimize form images and icons
- **Bundle Size**: Minimize JavaScript bundle size
- **Caching**: Cache static assets and API responses

### Backend Optimization
- **Database Indexing**: Optimize database queries
- **Connection Pooling**: Efficient database connections
- **Email Queue**: Asynchronous email sending
- **Rate Limiting**: Prevent abuse and spam

## Future Enhancements

### Planned Features
- **Social Login**: Google, Facebook, Apple authentication
- **Multi-language Support**: Internationalization
- **Advanced Validation**: Real-time field validation
- **Progressive Profiling**: Collect data over time

### Scalability Improvements
- **Microservices**: Separate registration service
- **Load Balancing**: Distribute registration load
- **Database Sharding**: Scale database horizontally
- **Caching Layer**: Redis for session management

## API Documentation

### Registration Endpoints

#### Create User Account
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "farmer",
  "additionalData": {
    "userType": "individual",
    "registrationType": "individual"
  }
}
```

#### Verify Email
```
GET /api/auth/verify?token=verification-token
```

#### Resend Verification Email
```
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Check Email Availability
```
GET /api/auth/check-email?email=user@example.com
```

## Support and Maintenance

### Regular Tasks
- **Monitor Registration Metrics**: Weekly review of registration data
- **Update Email Templates**: Keep email content current
- **Test Registration Flow**: Monthly end-to-end testing
- **Security Audits**: Quarterly security reviews

### Emergency Procedures
- **Registration Outage**: Fallback to mock registration
- **Database Issues**: Read-only mode with cached data
- **Email Service Issues**: Alternative email provider
- **Security Breach**: Immediate account suspension

## Conclusion

The registration system is designed to be:
- **Flexible**: Support multiple user types and registration flows
- **Secure**: Robust authentication and data protection
- **Scalable**: Handle growth in user registrations
- **Maintainable**: Clean code architecture and documentation

For questions or issues, refer to the troubleshooting section or contact the development team.
