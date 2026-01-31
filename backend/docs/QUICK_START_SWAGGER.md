# Quick Start: Swagger Documentation

## 🚀 3-Minute Guide to API Documentation

### Step 1: Start the Server (30 seconds)

```bash
# Navigate to the backend directory
cd backend

# Start the server
uv run python -m backend.main
```

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Open Swagger UI (10 seconds)

Open your browser and go to:

**http://localhost:8000/docs**

### Step 3: Explore the API (2 minutes)

You'll see the **Restaurant Backoffice API** documentation page.

#### What You'll See:

1. **API Header** at the top with description and version
2. **Three sections** (tags):
   - 📦 **orders** - Order management
   - 💚 **health** - Health checks
   - 🔧 **api** - Examples

3. **Expandable endpoints** - Click any endpoint to see details

## 🎯 Try Your First API Call

### Test 1: Check API Health

1. Find the **health** section
2. Click on **GET /health** to expand it
3. Click the **"Try it out"** button
4. Click **"Execute"**
5. See the response below with status "healthy"

**Expected Response:**
```json
{
  "status": "healthy",
  "app_name": "Restaurant Backoffice API",
  "version": "0.1.0",
  "timestamp": "2026-01-31T19:45:00.000000Z"
}
```

### Test 2: Create an Order

1. Find the **orders** section
2. Click on **POST /api/v1/orders** to expand it
3. Click the **"Try it out"** button
4. You'll see a pre-filled example - you can edit it or use as-is:
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
5. Click **"Execute"**
6. See the created order with ID and calculated total (30.00)

**Expected Response:**
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
    },
    {
      "id": 2,
      "name": "Fries",
      "amount": 1,
      "price": 5.00
    }
  ],
  "total": 30.00,
  "created_at": "2026-01-31T19:45:00.000000Z"
}
```

### Test 3: Get Pending Orders

1. Click on **GET /api/v1/orders/pending**
2. Click **"Try it out"**
3. Click **"Execute"** (no parameters needed)
4. See the list of pending orders (including the one you just created)

**Expected Response:**
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
      },
      {
        "id": 2,
        "name": "Fries",
        "amount": 1,
        "price": 5.00
      }
    ],
    "total": 30.00,
    "created_at": "2026-01-31T19:45:00.000000Z"
  }
]
```

## 🔍 What to Look For

### In Each Endpoint:

1. **Summary** - Quick description
2. **Description** - Detailed explanation
3. **Parameters** - What you need to send
4. **Request Body** - Data structure (for POST)
5. **Responses** - What you'll get back
6. **Examples** - Working examples

### Color Coding:

- 🟢 **GET** (Green) - Retrieve data
- 🔵 **POST** (Blue) - Create data
- 🟡 **PUT** (Yellow) - Update data
- 🟠 **PATCH** (Orange) - Partial update
- 🔴 **DELETE** (Red) - Remove data

## 💡 Pro Tips

### 1. Read the Description
Every endpoint has a detailed description explaining:
- What it does
- When to use it
- Validation rules
- Special behavior

### 2. Use the Examples
Examples are pre-filled and guaranteed to work. Start with them!

### 3. Test Validation
Try invalid data to see error messages:
- Set `table_number` to 0
- Use empty `items` array
- Set negative prices

### 4. Check Response Codes
- **200/201** = Success
- **422** = Validation error (check your input)
- **500** = Server error (check server logs)

### 5. Copy cURL Commands
After executing, scroll down to see the cURL command you can use in terminal.

## 📱 Alternative: ReDoc

For a cleaner, reading-focused view:

**http://localhost:8000/redoc**

ReDoc is great for:
- Reading documentation
- Understanding data models
- Printing or sharing
- Getting an overview

## 🛠️ For Developers

### Get OpenAPI Specification

**http://localhost:8000/openapi.json**

Use this JSON file with:
- Postman (Import → OpenAPI)
- Insomnia (Import → OpenAPI)
- Code generators
- API gateways

### Generate Client Code

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:8000/openapi.json \
  -g typescript-axios \
  -o ./client
```

## 🎓 Learn More

- **Detailed Guide**: See `docs/SWAGGER_DOCUMENTATION.md`
- **Feature Overview**: See `docs/SWAGGER_FEATURES.md`
- **API Reference**: See `docs/ORDERS_API.md`

## ❓ Troubleshooting

### Can't access http://localhost:8000/docs?

1. Make sure the server is running
2. Check you're using the correct port (8000)
3. Try http://127.0.0.1:8000/docs instead

### Getting errors when testing?

1. Check the validation rules in the description
2. Look at the example request format
3. Verify all required fields are included

### Want to test with real data?

1. Edit the example values in "Try it out"
2. Change table numbers, item names, prices
3. Add or remove items
4. Click Execute to test

## ✅ Checklist

- [ ] Server is running
- [ ] Opened http://localhost:8000/docs
- [ ] Tested GET /health
- [ ] Created an order with POST /api/v1/orders
- [ ] Retrieved orders with GET /api/v1/orders/pending
- [ ] Explored the schema documentation
- [ ] Tried invalid data to see validation

## 🎉 You're Ready!

You now know how to:
- ✅ Access the API documentation
- ✅ Test endpoints interactively
- ✅ Understand request/response formats
- ✅ See validation rules
- ✅ Handle errors

**Happy exploring!** 🚀

---

**Next Steps:**
- Explore all endpoints
- Read the detailed descriptions
- Test with your own data
- Share the docs URL with your team
