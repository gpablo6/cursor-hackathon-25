# Swagger/OpenAPI Documentation Guide

## Overview

The Restaurant Backoffice API includes **automatically generated interactive API documentation** using Swagger UI and ReDoc. These tools allow you to explore, test, and understand the API without writing any code.

## Accessing the Documentation

### 1. Start the Server

```bash
# From the backend directory
uv run python -m backend.main
```

The server will start at `http://localhost:8000`

### 2. Access Swagger UI (Interactive Documentation)

Open your browser and navigate to:

**http://localhost:8000/docs**

This provides an interactive interface where you can:
- View all available endpoints
- See request/response schemas
- Test endpoints directly from the browser
- View example requests and responses
- See validation rules and constraints

### 3. Access ReDoc (Alternative Documentation)

Open your browser and navigate to:

**http://localhost:8000/redoc**

This provides a clean, three-panel documentation interface that's great for:
- Reading comprehensive API documentation
- Understanding data models
- Viewing all endpoints in a structured format
- Printing or exporting documentation

### 4. Access OpenAPI JSON Schema

The raw OpenAPI specification is available at:

**http://localhost:8000/openapi.json**

This JSON file can be used with:
- API testing tools (Postman, Insomnia)
- Code generation tools
- API gateways
- Documentation generators

## Features of the Documentation

### 📋 Comprehensive Endpoint Information

Each endpoint includes:

- **Summary**: Brief description of what the endpoint does
- **Description**: Detailed explanation with usage notes
- **Request Body Schema**: Required and optional fields with validation rules
- **Response Schema**: Structure of successful responses
- **Error Responses**: All possible error codes with examples
- **Examples**: Real-world request and response examples

### 🎯 Interactive Testing (Swagger UI)

1. **Expand an endpoint** by clicking on it
2. Click **"Try it out"** button
3. **Fill in the request parameters** or body
4. Click **"Execute"** to send the request
5. **View the response** including status code, headers, and body

### 📊 Data Models

All data models (schemas) are documented with:
- Field names and types
- Validation constraints
- Descriptions
- Examples
- Required vs optional fields

### 🏷️ Organized by Tags

Endpoints are grouped by functionality:
- **Orders**: Order management operations
- **Health**: Health check and monitoring
- **API**: Example endpoints

## Example: Using Swagger UI to Create an Order

### Step-by-Step Guide

1. **Navigate to Swagger UI**: http://localhost:8000/docs

2. **Find the Orders section** and expand it

3. **Click on `POST /api/v1/orders`** to expand the endpoint

4. **Click "Try it out"** button (top right of the endpoint)

5. **Edit the request body** with your order data:
   ```json
   {
     "table_number": 5,
     "items": [
       {
         "name": "Burger",
         "amount": 2,
         "price": 12.50
       },
       {
         "name": "Fries",
         "amount": 1,
         "price": 5.00
       }
     ]
   }
   ```

6. **Click "Execute"** button

7. **View the response** below:
   - Status code: `201 Created`
   - Response body with the created order including ID and total
   - Response headers

### Testing Validation

Try these to see validation in action:

**Invalid table number (0 or negative):**
```json
{
  "table_number": 0,
  "items": [{"name": "Test", "amount": 1, "price": 10.00}]
}
```
Response: `422 Unprocessable Entity` with validation error details

**Empty items array:**
```json
{
  "table_number": 5,
  "items": []
}
```
Response: `422 Unprocessable Entity`

**Invalid price (too many decimals):**
```json
{
  "table_number": 5,
  "items": [{"name": "Test", "amount": 1, "price": 10.999}]
}
```
Response: `422 Unprocessable Entity`

## Documentation Features by Endpoint

### POST /api/v1/orders

**Documentation includes:**
- ✅ Detailed description of order creation process
- ✅ Validation rules for all fields
- ✅ Multiple request examples
- ✅ Success response example (201)
- ✅ Validation error example (422)
- ✅ Server error example (500)
- ✅ Field descriptions for all properties
- ✅ Automatic total calculation explanation

### GET /api/v1/orders/pending

**Documentation includes:**
- ✅ Description of filtering and sorting behavior
- ✅ Multiple response examples (with orders and empty)
- ✅ Success response example (200)
- ✅ Server error example (500)
- ✅ Explanation of pending status
- ✅ Order sorting information

### GET /health

**Documentation includes:**
- ✅ Purpose and use cases
- ✅ Response schema with all fields
- ✅ Example response
- ✅ Monitoring and health check information

## Schema Documentation

All schemas include comprehensive documentation:

### OrderCreate Schema
- Table number validation (must be > 0)
- Items array validation (at least 1 item required)
- Multiple complete examples
- Field descriptions

### OrderItemCreate Schema
- Name validation (1-255 characters)
- Amount validation (must be > 0)
- Price validation (must be > 0, max 2 decimals)
- Examples for each field

### OrderResponse Schema
- All fields documented
- Automatic total calculation explained
- Status enum values listed
- Complete example with nested items

## Exporting Documentation

### Export OpenAPI Spec

```bash
# Download the OpenAPI JSON
curl http://localhost:8000/openapi.json > openapi.json

# Or with Python
python -c "
from backend.main import app
import json
with open('openapi.json', 'w') as f:
    json.dump(app.openapi(), f, indent=2)
"
```

### Generate Client Code

Use the OpenAPI spec to generate client libraries:

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:8000/openapi.json \
  -g typescript-axios \
  -o ./client-typescript

# Generate Python client
openapi-generator-cli generate \
  -i http://localhost:8000/openapi.json \
  -g python \
  -o ./client-python
```

## Best Practices

### For API Consumers

1. **Start with Swagger UI** to understand the API interactively
2. **Test endpoints** directly in the browser before writing code
3. **Review examples** to understand expected data formats
4. **Check validation rules** to avoid errors
5. **Use the schemas** as a contract for your client code

### For API Developers

1. **Keep descriptions up to date** with code changes
2. **Add examples** for common use cases
3. **Document all error cases** with examples
4. **Use clear, concise language** in descriptions
5. **Group related endpoints** with tags

## Customization

The documentation is automatically generated from:

- **Endpoint decorators**: `summary`, `description`, `responses`
- **Pydantic schemas**: Field descriptions, examples, validation
- **FastAPI app config**: Title, description, tags, contact info
- **Docstrings**: Function documentation

All documentation is defined in the code, ensuring it stays in sync with the implementation.

## Troubleshooting

### Documentation not showing up?

1. Make sure the server is running: `uv run python -m backend.main`
2. Check the correct URL: `http://localhost:8000/docs`
3. Clear browser cache if needed
4. Check server logs for errors

### Examples not appearing?

1. Verify Pydantic schemas have `model_config` with examples
2. Check that `json_schema_extra` is properly formatted
3. Restart the server to reload changes

### Validation not working as expected?

1. Review the schema definitions in `src/backend/schemas/`
2. Check Pydantic validators
3. Test with Swagger UI to see validation messages

## Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **OpenAPI Specification**: https://swagger.io/specification/
- **Swagger UI**: https://swagger.io/tools/swagger-ui/
- **ReDoc**: https://redocly.com/redoc/

## Summary

The API documentation is:
- ✅ **Automatically generated** from code
- ✅ **Always up to date** with implementation
- ✅ **Interactive** for testing
- ✅ **Comprehensive** with examples and validation
- ✅ **Professional** and easy to navigate
- ✅ **Exportable** for client generation

No additional tools or manual documentation needed - everything is built into FastAPI!
