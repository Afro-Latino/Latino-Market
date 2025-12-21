# AFRO-LATINO API Contracts

## Table of Contents
1. [Authentication](#authentication)
2. [Products](#products)
3. [Categories & Regions](#categories--regions)
4. [Cart & Orders](#cart--orders)
5. [Recipes](#recipes)
6. [Users & Admin](#users--admin)
7. [Payment Integration](#payment-integration)
8. [Database Collections](#database-collections)

---

## Authentication

### Endpoints

#### POST /api/auth/google
**Description**: Initiate Google OAuth flow  
**Request Body**: None  
**Response**: Redirect URL to Google OAuth

#### POST /api/auth/session
**Description**: Create session from OAuth callback  
**Headers**: `X-Session-ID: <session_id>`  
**Response**:
```json
{
  "user_id": "string",
  "email": "string",
  "name": "string",
  "picture": "string",
  "session_token": "string"
}
```

#### POST /api/auth/register
**Description**: Register with email/password  
**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response**: User object + session_token

#### POST /api/auth/login
**Description**: Login with email/password  
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**: User object + session_token

#### GET /api/auth/me
**Description**: Get current user  
**Headers**: `Authorization: Bearer <session_token>` OR Cookie: `session_token`  
**Response**: User object

#### POST /api/auth/logout
**Description**: Logout and invalidate session  
**Headers**: `Authorization: Bearer <session_token>`  
**Response**: Success message

---

## Products

### Endpoints

#### GET /api/products
**Description**: Get all products with filters  
**Query Params**:
- `culture`: African | Latino | Fusion
- `category`: string
- `region`: string
- `country`: string
- `search`: string
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response**:
```json
{
  "products": [
    {
      "product_id": "string",
      "name": "string",
      "price": 12.99,
      "image": "string",
      "images": ["string"],
      "category": "string",
      "culture": "African | Latino | Fusion",
      "country": "string",
      "region": "string",
      "description": "string",
      "in_stock": true,
      "featured": true
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

#### GET /api/products/:id
**Description**: Get single product  
**Response**: Product object with full details

#### POST /api/products (Admin)
**Description**: Create new product  
**Auth**: Required (Admin)  
**Request Body**: Product fields  
**Response**: Created product

#### PUT /api/products/:id (Admin)
**Description**: Update product  
**Auth**: Required (Admin)  
**Request Body**: Product fields  
**Response**: Updated product

#### DELETE /api/products/:id (Admin)
**Description**: Delete product  
**Auth**: Required (Admin)  
**Response**: Success message

---

## Categories & Regions

#### GET /api/categories
**Response**:
```json
{
  "categories": [
    {
      "category_id": "string",
      "name": "string",
      "icon": "string",
      "product_count": 45
    }
  ]
}
```

#### GET /api/regions
**Response**:
```json
{
  "regions": [
    {
      "region_id": "string",
      "name": "string",
      "countries": ["string"],
      "image": "string"
    }
  ]
}
```

#### POST /api/categories (Admin)
#### PUT /api/categories/:id (Admin)
#### DELETE /api/categories/:id (Admin)

---

## Cart & Orders

### Cart (Frontend LocalStorage)
Mock data in `mock.js`:
- `getCart()` - Returns cart array
- `addToCart(product, quantity)`
- `removeFromCart(productId)`
- `updateCartQuantity(productId, quantity)`
- `clearCart()`

### Orders API

#### POST /api/orders
**Description**: Create order from cart  
**Auth**: Required  
**Request Body**:
```json
{
  "items": [
    {
      "product_id": "string",
      "quantity": 1,
      "price": 12.99
    }
  ],
  "delivery_info": {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "Moncton",
    "province": "NB",
    "postal_code": "string",
    "delivery_notes": "string"
  },
  "payment_method": "stripe | paypal"
}
```
**Response**:
```json
{
  "order_id": "string",
  "payment_url": "string" // Stripe/PayPal checkout URL
}
```

#### GET /api/orders
**Description**: Get user's orders  
**Auth**: Required  
**Response**: Array of orders

#### GET /api/orders/:id
**Description**: Get single order  
**Auth**: Required  
**Response**: Order object with items

---

## Recipes

#### GET /api/recipes
**Query Params**:
- `culture`: African | Latino | Fusion
- `search`: string

**Response**:
```json
{
  "recipes": [
    {
      "recipe_id": "string",
      "title": "string",
      "culture": "string",
      "image": "string",
      "description": "string",
      "cook_time": "string",
      "difficulty": "Easy | Medium | Advanced",
      "ingredients": ["string"],
      "instructions": ["string"]
    }
  ]
}
```

#### POST /api/recipes (Admin)
#### PUT /api/recipes/:id (Admin)
#### DELETE /api/recipes/:id (Admin)

---

## Users & Admin

#### GET /api/users (Admin)
**Description**: Get all users  
**Auth**: Required (Admin)  
**Response**: Array of users

#### GET /api/users/:id
**Description**: Get user profile  
**Auth**: Required (Self or Admin)  
**Response**: User object

#### PUT /api/users/:id
**Description**: Update user profile  
**Auth**: Required (Self or Admin)  
**Request Body**: User fields

---

## Payment Integration

### Stripe

#### POST /api/payments/stripe/create-checkout
**Description**: Create Stripe checkout session  
**Auth**: Required  
**Request Body**:
```json
{
  "order_id": "string",
  "amount": 45.99,
  "currency": "cad",
  "success_url": "string",
  "cancel_url": "string"
}
```
**Response**:
```json
{
  "session_id": "string",
  "checkout_url": "string"
}
```

#### POST /api/payments/stripe/webhook
**Description**: Handle Stripe webhooks  
**Headers**: `Stripe-Signature`  
**Response**: Success

#### GET /api/payments/stripe/status/:session_id
**Description**: Check payment status  
**Response**:
```json
{
  "status": "paid | pending | failed",
  "amount": 45.99
}
```

### PayPal

#### POST /api/payments/paypal/create-order
**Description**: Create PayPal order  
**Response**: PayPal order ID

#### POST /api/payments/paypal/capture/:order_id
**Description**: Capture PayPal payment  
**Response**: Payment status

---

## Database Collections

### users
```javascript
{
  user_id: "string", // Custom UUID
  email: "string",
  name: "string",
  picture: "string",
  auth_provider: "google | email",
  password_hash: "string", // Only for email auth
  phone: "string",
  address: "string",
  is_admin: false,
  created_at: Date,
  updated_at: Date
}
```

### user_sessions
```javascript
{
  session_token: "string",
  user_id: "string",
  expires_at: Date,
  created_at: Date
}
```

### products
```javascript
{
  product_id: "string",
  name: "string",
  price: 12.99,
  image: "string",
  images: ["string"],
  category: "string",
  culture: "African | Latino | Fusion",
  country: "string",
  region: "string",
  description: "string",
  ingredients: "string",
  storage_instructions: "string",
  in_stock: true,
  featured: false,
  created_at: Date,
  updated_at: Date
}
```

### categories
```javascript
{
  category_id: "string",
  name: "string",
  icon: "string",
  created_at: Date
}
```

### regions
```javascript
{
  region_id: "string",
  name: "string",
  countries: ["string"],
  image: "string",
  created_at: Date
}
```

### recipes
```javascript
{
  recipe_id: "string",
  title: "string",
  culture: "African | Latino | Fusion",
  image: "string",
  description: "string",
  cook_time: "string",
  difficulty: "Easy | Medium | Advanced",
  ingredients: ["string"],
  instructions: ["string"],
  created_at: Date,
  updated_at: Date
}
```

### orders
```javascript
{
  order_id: "string",
  user_id: "string",
  items: [
    {
      product_id: "string",
      name: "string",
      price: 12.99,
      quantity: 1,
      image: "string"
    }
  ],
  delivery_info: {
    first_name: "string",
    last_name: "string",
    email: "string",
    phone: "string",
    address: "string",
    city: "string",
    province: "string",
    postal_code: "string",
    delivery_notes: "string"
  },
  subtotal: 45.99,
  delivery_fee: 10.00,
  total: 55.99,
  payment_method: "stripe | paypal",
  payment_status: "pending | paid | failed",
  order_status: "processing | shipped | delivered | cancelled",
  created_at: Date,
  updated_at: Date
}
```

### payment_transactions
```javascript
{
  transaction_id: "string",
  order_id: "string",
  user_id: "string",
  amount: 55.99,
  currency: "cad",
  payment_method: "stripe | paypal",
  payment_status: "pending | paid | failed",
  stripe_session_id: "string",
  paypal_order_id: "string",
  created_at: Date,
  updated_at: Date
}
```

### testimonials
```javascript
{
  testimonial_id: "string",
  name: "string",
  location: "string",
  culture: "African | Latino | Fusion",
  rating: 5,
  text: "string",
  avatar: "string",
  created_at: Date
}
```

---

## Mock Data in Frontend (mock.js)

Currently mocked:
- `mockProducts` - 8 products
- `mockCategories` - 11 categories
- `mockRegions` - 6 regions
- `mockRecipes` - 3 recipes
- `mockMealKits` - 3 meal kits
- `mockTestimonials` - 3 testimonials
- Cart management (localStorage)

**Backend Integration**: Replace all mock data fetching with actual API calls to corresponding endpoints.

---

## Frontend-Backend Integration Points

1. **Homepage**:
   - GET /api/products?featured=true
   - GET /api/categories
   - GET /api/regions
   - GET /api/testimonials

2. **Shop Page**:
   - GET /api/products with filters

3. **Product Detail**:
   - GET /api/products/:id

4. **Checkout**:
   - POST /api/orders
   - Redirect to payment gateway

5. **Recipes**:
   - GET /api/recipes

6. **Admin Panel**:
   - Full CRUD on all resources

7. **Auth**:
   - Integrate Emergent Google OAuth
   - JWT-based email/password auth

---

## Implementation Priority

1. ✅ **Frontend with Mock Data** - COMPLETE
2. **Backend Setup**:
   - FastAPI server structure
   - MongoDB connection
   - Auth middleware
3. **Authentication**:
   - Google OAuth integration
   - Email/password with JWT
4. **Products & Categories APIs**
5. **Orders & Checkout**
6. **Payment Integration** (Stripe + PayPal)
7. **Admin APIs**
8. **Frontend Integration** (Replace mock data)
9. **AI Search** (Smart product search)
10. **Testing & Polish**
