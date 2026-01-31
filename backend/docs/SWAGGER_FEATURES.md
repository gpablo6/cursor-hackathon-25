# Swagger UI Features Overview

## What You'll See in Swagger UI

When you navigate to **http://localhost:8000/docs**, you'll see a comprehensive, interactive API documentation interface.

## Main Features

### 1. API Information Header

At the top of the page, you'll see:
- **API Title**: "Restaurant Backoffice API"
- **Version**: 0.1.0
- **Description**: Overview of the API with features and getting started guide
- **Contact Information**: Support email
- **License**: MIT

### 2. Organized Endpoint Groups (Tags)

Endpoints are organized into logical groups:

#### 📦 Orders
*Operations for managing restaurant orders*
- Create new orders
- Retrieve pending orders
- Track order status

#### 💚 Health
*Health check and status endpoints*
- Monitor API availability
- Get application metadata

#### 🔧 API
*Example endpoints for reference*
- Sample implementations
- Testing endpoints

### 3. Detailed Endpoint Documentation

Each endpoint shows:

#### Endpoint Header
- HTTP Method (POST, GET, etc.) with color coding
- Endpoint path
- Summary (one-line description)
- Expand/collapse button

#### When Expanded
- **Description**: Detailed explanation with usage notes
- **Parameters**: Query, path, or header parameters (if any)
- **Request Body**: 
  - Schema with field types
  - Validation rules
  - Required/optional indicators
  - Example values
  - Field descriptions
- **Responses**:
  - Success responses (200, 201, etc.)
  - Error responses (422, 500, etc.)
  - Response schemas
  - Example responses
  - Response descriptions

### 4. Interactive Testing

For each endpoint, you can:

1. **Click "Try it out"** button
2. **Edit the request**:
   - Modify example values
   - Add/remove fields
   - Change parameters
3. **Click "Execute"** to send the request
4. **View the response**:
   - HTTP status code
   - Response headers
   - Response body (formatted JSON)
   - Response time
   - cURL command equivalent

### 5. Schema Documentation

At the bottom of the page, you'll find the "Schemas" section showing:

#### OrderCreate
- Fields: `table_number`, `items`
- Validation rules
- Required fields marked
- Example values
- Nested schemas (OrderItemCreate)

#### OrderItemCreate
- Fields: `name`, `amount`, `price`
- Type information
- Constraints (min, max, pattern)
- Examples

#### OrderResponse
- All fields with descriptions
- Nested items array
- Computed fields (total)
- Timestamp format

#### HealthResponse
- Status field
- Application metadata
- Timestamp

## Example: POST /api/v1/orders

### What You'll See

**Summary**: "Create a new order"

**Description**:
```
Create a new restaurant order for a specific table.

The order will be created with a 'pending' status and will include 
all specified items. The total price is calculated automatically 
based on the items' amounts and prices.

Validation Rules:
• Table number must be greater than 0
• At least one item is required
• Each item must have a valid name (1-255 characters)
• Item amounts must be greater than 0
• Item prices must be positive with at most 2 decimal places
```

**Request Body Schema**:
```json
{
  "table_number": 5,        // integer (required, > 0)
  "items": [                // array (required, min 1 item)
    {
      "name": "Burger",     // string (required, 1-255 chars)
      "amount": 2,          // integer (required, > 0)
      "price": 12.50        // number (required, > 0, max 2 decimals)
    }
  ]
}
```

**Responses**:

**201 Created** - Success
```json
{
  "id": 1,
  "table_number": 5,
  "status": "pending",
  "items": [
    {
      "id": 1,
      "name": "Burger",
      "amount": 2,
      "price": 12.50
    }
  ],
  "total": 25.00,
  "created_at": "2026-01-31T19:45:00.000000Z"
}
```

**422 Unprocessable Entity** - Validation Error
```json
{
  "detail": [
    {
      "type": "greater_than",
      "loc": ["body", "table_number"],
      "msg": "Input should be greater than 0",
      "input": 0
    }
  ]
}
```

**500 Internal Server Error** - Server Error
```json
{
  "detail": "Failed to create order"
}
```

## Example: GET /api/v1/orders/pending

### What You'll See

**Summary**: "Get all pending orders"

**Description**:
```
Retrieve all orders that are currently in 'pending' status.

Orders are returned sorted by creation time (oldest first), 
making it easy to process orders in the order they were received.

Response:
• Returns an array of orders (can be empty if no pending orders exist)
• Each order includes all items and the calculated total
• Only orders with 'pending' status are included
```

**No Parameters Required**

**Responses**:

**200 OK** - Success (Multiple Orders)
```json
[
  {
    "id": 1,
    "table_number": 5,
    "status": "pending",
    "items": [
      {
        "id": 1,
        "name": "Burger",
        "amount": 2,
        "price": 12.50
      }
    ],
    "total": 25.00,
    "created_at": "2026-01-31T19:45:00.000000Z"
  },
  {
    "id": 2,
    "table_number": 3,
    "status": "pending",
    "items": [
      {
        "id": 3,
        "name": "Pizza",
        "amount": 1,
        "price": 15.00
      }
    ],
    "total": 15.00,
    "created_at": "2026-01-31T19:46:00.000000Z"
  }
]
```

**200 OK** - Success (No Orders)
```json
[]
```

## Color Coding

Swagger UI uses colors to indicate HTTP methods:

- 🟢 **GET** - Green (Retrieve data)
- 🔵 **POST** - Blue (Create data)
- 🟡 **PUT** - Yellow (Update/replace data)
- 🟠 **PATCH** - Orange (Partial update)
- 🔴 **DELETE** - Red (Remove data)

## Additional Features

### Authorization (Future)
When authentication is added, you'll see:
- 🔒 Lock icon on protected endpoints
- "Authorize" button at the top
- Token input dialog

### Models/Schemas Section
- Click on any schema name to expand it
- See all fields and their types
- View nested schemas
- Copy example JSON

### Try It Out
- Pre-filled with example data
- Edit any field
- See validation errors in real-time
- Get cURL command for CLI testing

### Download Specification
- Download OpenAPI JSON
- Use with Postman, Insomnia
- Generate client code
- Share with team

## Tips for Using Swagger UI

1. **Start with GET endpoints** - They're safe to test
2. **Use the examples** - They're guaranteed to work
3. **Test validation** - Try invalid data to see error messages
4. **Copy cURL commands** - Use them in your scripts
5. **Check response codes** - Understand what each code means
6. **Read descriptions** - They contain important usage information

## Comparison: Swagger UI vs ReDoc

### Swagger UI (http://localhost:8000/docs)
✅ Interactive testing  
✅ Try endpoints in browser  
✅ Edit and execute requests  
✅ See real responses  
✅ Great for development and testing  

### ReDoc (http://localhost:8000/redoc)
✅ Clean, three-panel layout  
✅ Better for reading  
✅ Search functionality  
✅ Print-friendly  
✅ Great for documentation review  

**Recommendation**: Use Swagger UI for testing, ReDoc for reading.

## What Makes This Documentation Special

1. **Always Up to Date**: Generated from code, never outdated
2. **Interactive**: Test without writing code
3. **Comprehensive**: Every field documented
4. **Examples**: Real-world usage examples
5. **Validation**: See rules and constraints
6. **Error Handling**: All error cases documented
7. **Professional**: Clean, organized interface
8. **Accessible**: No authentication needed (for now)

## Next Steps

1. **Start the server**: `uv run python -m backend.main`
2. **Open Swagger UI**: http://localhost:8000/docs
3. **Explore the endpoints**: Click to expand
4. **Try it out**: Test the API interactively
5. **Read the descriptions**: Understand the API behavior
6. **Use the examples**: Copy and modify for your needs

Happy exploring! 🚀
