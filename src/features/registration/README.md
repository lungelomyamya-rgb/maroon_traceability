# @maroon-traceability/registration

User registration and authentication feature for the Maroon Traceability system.

## Overview

This feature handles user registration, authentication, and profile management using Supabase as the backend. It's designed to be the only feature that directly interacts with the database, following the database isolation principle.

## Installation

```bash
npm install @maroon-traceability/registration
```

## Dependencies

### Peer Dependencies
- React ^18.0.0
- React DOM ^18.0.0
- @supabase/supabase-js ^2.0.0

### Dependencies
- zod ^4.2.1

## Usage

### Basic Setup

```typescript
import { registrationAPI, isSupabaseAvailable } from '@maroon-traceability/registration';

// Check if Supabase is configured
if (isSupabaseAvailable()) {
  const { supabase } = registrationAPI;
  // Use Supabase client
}
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## API

### Services

#### `supabase`
The Supabase client instance. Returns `null` if not configured.

```typescript
import { supabase } from '@maroon-traceability/registration';

const { data, error } = await supabase
  .from('users')
  .select('*');
```

#### `isSupabaseAvailable()`
Check if Supabase is properly configured.

```typescript
import { isSupabaseAvailable } from '@maroon-traceability/registration';

if (isSupabaseAvailable()) {
  // Supabase is available
}
```

#### `getSupabaseAdmin()`
Get an admin Supabase client with elevated permissions (server-side only).

```typescript
import { getSupabaseAdmin } from '@maroon-traceability/registration';

// Server-side usage
const adminClient = getSupabaseAdmin();
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  phone TEXT,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Considerations

- **Database Isolation**: This is the only feature that should import Supabase directly
- **Environment Variables**: Never expose service role keys on the client side
- **Row Level Security**: Configure RLS policies in Supabase for data protection

## Development

### Building

```bash
npm run build
```

### Watching for Changes

```bash
npm run dev
```

### Cleaning

```bash
npm run clean
```

## Testing

```typescript
import { registrationAPI } from '@maroon-traceability/registration';

// Mock Supabase for testing
const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    signIn: jest.fn(),
  },
  from: jest.fn(),
};

// Test with mock
jest.mock('@maroon-traceability/registration', () => ({
  registrationAPI: {
    ...registrationAPI,
    supabase: mockSupabase,
  },
}));
```

## Migration Guide

### From Direct Supabase Usage

**Before:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);
```

**After:**
```typescript
import { registrationAPI } from '@maroon-traceability/registration';

const { supabase } = registrationAPI;
```

## Contributing

1. Follow the existing code patterns
2. Add TypeScript types for all new functions
3. Include tests for new functionality
4. Update documentation

## License

MIT License - see LICENSE file for details.
