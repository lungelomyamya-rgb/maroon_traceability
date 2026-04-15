# Maroon Traceability API Documentation

## Overview

The Maroon Traceability system provides a comprehensive REST API for managing product traceability, user authentication, and blockchain integration. This documentation covers all available endpoints, request/response formats, and usage examples.

## Table of Contents

- [Authentication](#authentication)
- [Product Management](#product-management)
- [Traceability](#traceability)
- [User Management](#user-management)
- [Analytics](#analytics)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Base URL

```
Production: https://api.maroon-traceability.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication

### JWT Token Authentication

All API endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Login Endpoint

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "role": "farmer",
      "name": "John Doe"
    },
    "expiresIn": 86400
  }
}
```

### Refresh Token

```http
POST /auth/refresh
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

## Product Management

### Get All Products

```http
GET /products?page=1&limit=20&category=vegetables&status=verified
Authorization: Bearer <token>
```

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `category` (optional): Filter by category
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-123",
        "name": "Organic Tomatoes",
        "description": "Fresh organic tomatoes from local farm",
        "category": "vegetables",
        "status": "verified",
        "location": "Cape Town",
        "price": 25.99,
        "quantity": 100,
        "farmer": {
          "id": "farmer-123",
          "name": "John Doe"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### Create Product

```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Organic Lettuce",
  "description": "Fresh organic lettuce",
  "category": "vegetables",
  "location": "Johannesburg",
  "price": 15.99,
  "quantity": 50,
  "certifications": ["organic", "non-gmo"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod-456",
    "name": "Organic Lettuce",
    "description": "Fresh organic lettuce",
    "category": "vegetables",
    "status": "pending",
    "location": "Johannesburg",
    "price": 15.99,
    "quantity": 50,
    "farmer": {
      "id": "farmer-123",
      "name": "John Doe"
    },
    "certifications": ["organic", "non-gmo"],
    "createdAt": "2024-01-16T14:30:00Z",
    "updatedAt": "2024-01-16T14:30:00Z"
  }
}
```

### Update Product

```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 17.99,
  "quantity": 45,
  "description": "Fresh organic lettuce - updated description"
}
```

### Delete Product

```http
DELETE /products/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Traceability

### Get Product Traceability

```http
GET /traceability/:productId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "prod-123",
      "name": "Organic Tomatoes",
      "batchId": "batch-456",
      "currentLocation": "Retail Store",
      "status": "in-transit"
    },
    "journey": [
      {
        "id": "step-1",
        "type": "harvest",
        "location": "Farm A",
        "timestamp": "2024-01-15T08:00:00Z",
        "operator": "John Doe",
        "details": {
          "quantity": 100,
          "quality": "Grade A",
          "certifications": ["organic"]
        }
      },
      {
        "id": "step-2",
        "type": "processing",
        "location": "Processing Facility",
        "timestamp": "2024-01-15T12:00:00Z",
        "operator": "Processing Co",
        "details": {
          "processType": "washing",
          "temperature": "4°C",
          "duration": "2 hours"
        }
      }
    ],
    "blockchain": {
      "transactions": [
        {
          "hash": "0x123...",
          "timestamp": "2024-01-15T08:05:00Z",
          "blockNumber": 12345,
          "verified": true
        }
      ]
    }
  }
}
```

### Add Traceability Step

```http
POST /traceability/:productId/steps
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "transport",
  "location": "Distribution Center",
  "details": {
    "vehicle": "Truck-123",
    "driver": "Mike Johnson",
    "temperature": "4°C",
    "estimatedArrival": "2024-01-16T10:00:00Z"
  }
}
```

## User Management

### Get User Profile

```http
GET /users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "farmer",
    "permissions": ["create_product", "view_traceability"],
    "profile": {
      "phone": "+27 12 345 6789",
      "address": "123 Farm Road, Cape Town",
      "farmName": "Happy Farms",
      "certifications": ["organic", "global-gap"]
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLogin": "2024-01-16T09:30:00Z"
  }
}
```

### Update User Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "profile": {
    "phone": "+27 12 345 6790",
    "address": "124 Farm Road, Cape Town"
  }
}
```

## Analytics

### Get Dashboard Analytics

```http
GET /analytics/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalProducts": 150,
      "activeProducts": 120,
      "pendingVerification": 15,
      "totalRevenue": 45678.90
    },
    "traceability": {
      "totalScans": 1250,
      "uniqueScans": 890,
      "averageScanTime": 2.3,
      "topLocations": ["Cape Town", "Johannesburg", "Durban"]
    },
    "performance": {
      "averageLoadTime": 1.2,
      "uptime": 99.9,
      "errorRate": 0.1
    }
  }
}
```

### Get Product Analytics

```http
GET /analytics/products?period=30d&category=vegetables
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "products": [
      {
        "id": "prod-123",
        "name": "Organic Tomatoes",
        "metrics": {
          "views": 450,
          "scans": 230,
          "sales": 180,
          "revenue": 4678.20,
          "averageRating": 4.5
        }
      }
    ],
    "summary": {
      "totalViews": 1250,
      "totalScans": 680,
      "totalSales": 520,
      "totalRevenue": 12345.67
    }
  }
}
```

## Error Handling

### Error Response Format

All error responses follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2024-01-16T10:30:00Z",
    "requestId": "req-123"
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Invalid input data | 400 |
| `UNAUTHORIZED` | Invalid or missing token | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Resource conflict | 409 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Product operations | 100 requests | 1 hour |
| Traceability | 200 requests | 1 hour |
| Analytics | 50 requests | 1 hour |

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642368000
```

## SDK and Libraries

### JavaScript/TypeScript SDK

```bash
npm install @maroon-traceability/sdk
```

```typescript
import { MaroonTraceabilityAPI } from '@maroon-traceability/sdk';

const api = new MaroonTraceabilityAPI({
  baseURL: 'https://api.maroon-traceability.com/v1',
  token: 'your-jwt-token'
});

// Get products
const products = await api.products.list({
  page: 1,
  limit: 20,
  category: 'vegetables'
});

// Create product
const product = await api.products.create({
  name: 'Organic Lettuce',
  description: 'Fresh organic lettuce',
  category: 'vegetables',
  price: 15.99,
  quantity: 50
});
```

### Python SDK

```bash
pip install maroon-traceability-sdk
```

```python
from maroon_traceability import MaroonTraceabilityAPI

api = MaroonTraceabilityAPI(
    base_url='https://api.maroon-traceability.com/v1',
    token='your-jwt-token'
)

# Get products
products = api.products.list(
    page=1,
    limit=20,
    category='vegetables'
)

# Create product
product = api.products.create(
    name='Organic Lettuce',
    description='Fresh organic lettuce',
    category='vegetables',
    price=15.99,
    quantity=50
)
```

## Webhooks

### Configure Webhooks

Webhooks allow you to receive real-time notifications about events:

```http
POST /webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/maroon",
  "events": ["product.created", "product.verified", "traceability.updated"],
  "secret": "your-webhook-secret"
}
```

### Webhook Payload

```json
{
  "event": "product.created",
  "data": {
    "product": {
      "id": "prod-456",
      "name": "Organic Lettuce",
      "category": "vegetables"
    }
  },
  "timestamp": "2024-01-16T10:30:00Z",
  "signature": "sha256=..."
}
```

## Support

For API support and questions:
- Email: api-support@maroon-traceability.com
- Documentation: https://docs.maroon-traceability.com
- Status Page: https://status.maroon-traceability.com

## Changelog

### v1.2.0 (2024-01-16)
- Added webhook support
- Enhanced analytics endpoints
- Improved error handling

### v1.1.0 (2024-01-01)
- Added user management endpoints
- Implemented rate limiting
- Added SDK support

### v1.0.0 (2023-12-01)
- Initial API release
- Core product and traceability features
- Authentication system
