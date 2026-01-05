# Pagination API Documentation

## Overview

All list endpoints now support pagination using a standardized approach. This improves performance and user experience when dealing with large datasets.

## Pagination Parameters

### Query Parameters

- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 20, minimum: 1, maximum: 100)

### Example Request

```
GET /api/users?page=2&limit=10
```

## Response Format

All paginated endpoints return data in the following format:

```json
{
  "data": [...], // Array of items
  "meta": {
    "page": 2,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### Response Fields

- `data`: Array of items for the current page
- `meta.page`: Current page number
- `meta.limit`: Items per page
- `meta.total`: Total number of items
- `meta.totalPages`: Total number of pages
- `meta.hasNext`: Whether there is a next page
- `meta.hasPrev`: Whether there is a previous page

## Endpoints with Pagination

The following endpoints support pagination:

- `/api/users` - User list
- `/api/equipment` - Equipment list
- `/api/species` - Species list
- `/api/missions` - Missions list
- `/api/documents` - Documents list (already had pagination)
- `/api/leaves` - Leaves list (already had pagination)
- `/api/publications` - Publications list (already had pagination)
- `/api/climate-data` - Climate data list (already had pagination)

## Usage Examples

### Basic Pagination

```typescript
// First page, default limit (20)
const response = await fetch('/api/users?page=1');
const { data, meta } = await response.json();
```

### Custom Page Size

```typescript
// Page 2 with 10 items per page
const response = await fetch('/api/users?page=2&limit=10');
const { data, meta } = await response.json();
```

### Frontend Implementation

```typescript
const [page, setPage] = useState(1);
const [limit] = useState(20);

const fetchUsers = async () => {
  const response = await fetch(`/api/users?page=${page}&limit=${limit}`);
  const { data, meta } = await response.json();
  setUsers(data);
  setPagination(meta);
};

// Navigation
const nextPage = () => {
  if (pagination.hasNext) {
    setPage(page + 1);
  }
};

const prevPage = () => {
  if (pagination.hasPrev) {
    setPage(page - 1);
  }
};
```

## Defaults and Limits

- **Default page**: 1
- **Default limit**: 20 items per page
- **Minimum limit**: 1
- **Maximum limit**: 100 items per page

## Backward Compatibility

Endpoints that previously returned arrays directly now return the paginated format. If you need to maintain backward compatibility, you can:

1. Check for the `meta` field to determine if pagination is enabled
2. Use `?limit=1000` to get all items (up to the max limit)
3. Handle both array and paginated responses

## Performance Benefits

- Reduced database load
- Faster response times
- Lower memory usage
- Better user experience with large datasets

## Migration Notes

If you have existing frontend code that expects arrays:

```typescript
// Old code
const users = await response.json();

// New code
const { data: users } = await response.json();
```

