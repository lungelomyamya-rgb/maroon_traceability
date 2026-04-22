# Supabase Setup Guide

This guide will help you set up Supabase for the Maroon Traceability Demo registration system.

## Prerequisites

- Supabase account (free tier is sufficient for development)
- Your Supabase project URL and API keys
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization (or create one)
5. Enter project details:
   - **Project Name**: `maroon-traceability-demo`
   - **Database Password**: Create a strong password and save it
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Replace the values with your actual Supabase credentials.

## Step 4: Set Up Database Schema

### Option A: Use the Supabase Dashboard

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy the contents of `database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

### Option B: Use the Command Line

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply the schema
supabase db push database/schema.sql
```

## Step 5: Configure Authentication

1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Configure the following settings:

### Site URL
```
Site URL: http://localhost:3000
```

### Redirect URLs
Add these redirect URLs:
```
http://localhost:3000/auth/callback
http://localhost:3000/verification-pending
https://your-domain.com/auth/callback (for production)
```

### Email Templates
1. Go to **Authentication** > **Email Templates**
2. Customize the "Confirm signup" template
3. Example template:
```
<h2>Welcome to Maroon Traceability!</h2>
<p>Click the link below to verify your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email</a></p>
<p>This link expires in 24 hours.</p>
```

## Step 6: Enable Email Provider

1. Go to **Authentication** > **Providers**
2. Enable the **Email** provider
3. Configure settings:
   - **Enable email confirmations**: ON
   - **Enable custom SMTP**: OFF (use Supabase email service for development)

## Step 7: Test the Configuration

### Test Database Connection

Create a simple test file `test-supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Connection error:', error);
    } else {
      console.log('Connection successful!');
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testConnection();
```

Run the test:
```bash
node test-supabase.js
```

### Test Registration

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/register/individual`
3. Fill out the registration form
4. Check your email for the verification link
5. Click the verification link
6. Check if you can log in

## Step 8: Configure Production Settings

### Environment Variables for Production

Update your production environment variables:

```bash
# Production Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-production-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-production-service-role-key"
```

### Security Settings

1. Go to **Authentication** > **Settings**
2. Set **Site URL** to your production domain
3. Add production redirect URLs
4. Enable **Rate limiting** if needed
5. Configure **Session timeout** (recommended: 24 hours)

### Database Security

1. Go to **Settings** > **Database**
2. Enable **Row Level Security** (RLS) policies
3. Review and update RLS policies as needed
4. Set up **Database backups**

## Step 9: Monitor and Maintain

### Dashboard Monitoring

Regularly check:
- **Authentication** tab for user activity
- **Database** tab for performance
- **Logs** tab for errors

### Common Issues and Solutions

#### Issue: Email not received
- Check spam folder
- Verify email address is correct
- Check Supabase email logs

#### Issue: Registration fails
- Check browser console for errors
- Verify environment variables are set
- Check database schema is applied

#### Issue: Cannot log in after registration
- Ensure email verification is completed
- Check if user is marked as `is_active`
- Verify RLS policies allow access

## Step 10: Advanced Configuration (Optional)

### Custom SMTP Setup

For production, you might want to use your own SMTP server:

1. Go to **Authentication** > **Email Templates**
2. Enable **Custom SMTP**
3. Configure your SMTP settings:
   ```
   SMTP Host: smtp.your-provider.com
   SMTP Port: 587
   SMTP User: your-email@your-domain.com
   SMTP Pass: your-app-password
   ```

### Database Functions

The schema includes useful functions:

```sql
-- Check if email is available
SELECT is_email_available('test@example.com');

-- Get user by email
SELECT * FROM get_user_by_email('test@example.com');
```

### Row Level Security (RLS)

The schema includes RLS policies for:
- Users can only view/edit their own profile
- Registration attempts are publicly insertable
- Email verification tokens are publicly accessible

## Troubleshooting

### Common Error Messages

#### "Invalid JWT"
- Check if environment variables are correct
- Verify JWT tokens are not expired
- Ensure service role key is used for admin operations

#### "Database relation does not exist"
- Run the schema setup script
- Check if tables were created successfully
- Verify table names match exactly

#### "Permission denied"
- Check RLS policies
- Ensure user is authenticated
- Verify service role key for admin operations

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```bash
NEXT_PUBLIC_DEBUG=true
```

This will provide more detailed error messages in the browser console.

## Next Steps

Once Supabase is set up:

1. Test all registration flows (individual, commercial, SMME, retailer)
2. Test email verification process
3. Test login functionality
4. Set up monitoring and alerts
5. Configure production settings

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the [GitHub Issues](https://github.com/supabase/supabase/issues)
3. Contact Supabase support for account-specific issues

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all secrets**
3. **Enable RLS on all sensitive tables**
4. **Regularly rotate your service role key**
5. **Monitor authentication logs for suspicious activity**
6. **Use HTTPS in production**
7. **Implement rate limiting for authentication endpoints**

Your Supabase integration is now ready for the Maroon Traceability Demo!
