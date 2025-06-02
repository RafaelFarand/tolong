# Gudang Sparepart - E-Commerce Application

## Project Overview

This is a full-stack e-commerce application built using the MERN stack (MySQL, Express.js, React.js, Node.js). The application is designed for managing and selling spare parts, featuring user authentication, product management, shopping cart functionality, and order processing.

## Architecture

### Backend (Node.js + Express.js)

Located in the `/backend` directory, the backend serves as a RESTful API service.

#### Key Components:

1. **Authentication & Authorization**

   - JWT-based authentication system
   - Refresh token mechanism
   - Cookie-based token storage
   - Middleware for route protection

2. **Database**

   - MySQL database integration
   - Configured in `/backend/config/Database.js`

3. **File Storage**

   - Local file storage for product images
   - Configured in `/backend/config/Storage.js`

4. **API Controllers**

   - `UserController.js` - User management and authentication
   - `ProductController.js` - Product CRUD operations
   - `OrderController.js` - Order processing and management
   - `RefreshTokenController.js` - Token refresh functionality

5. **Models**

   - `UserModel.js` - User data schema
   - `ProductModel.js` - Product data schema
   - `OrderModel.js` - Order data schema

6. **Routes**
   - `/routes/UserRoutes.js` - User-related endpoints
   - `/routes/ProductRoutes.js` - Product-related endpoints
   - `/routes/OrderRoutes.js` - Order-related endpoints
   - `/routes/RefreshTokenRoutes.js` - Token refresh endpoints

### Frontend (React.js)

Located in the `/frontend` directory, the frontend provides the user interface.

#### Key Features:

1. **Components**

   - `navbar.js` - Navigation component
   - `cart.js` & `cartIcon.js` - Shopping cart functionality
   - `footer.js` - Footer component
   - `loading.js` - Loading state component
   - `ErrorBoundary.js` - Error handling component

2. **Pages**

   - `home.js` - Landing page
   - `login.js` & `register.js` - Authentication pages
   - `product.js` - Product listing and details
   - `dashboard.js` - Admin dashboard
   - `cartPage.js` - Shopping cart view
   - `checkout.js` - Order checkout process
   - `checkoutHistory.js` - Order history
   - `EditProduct.js` & `ProductForm.js` - Product management
   - `UserEdit.js` - User profile management

3. **Styling**
   - Custom CSS with responsive design
   - Page transition animations
   - Modern UI components

## Cloud Deployment

The application is configured for Google Cloud Platform deployment:

- Backend: `cloudbuild.be.yaml`
- Frontend: `cloudbuild.fe.yaml`
- Frontend configuration: `app.yaml`

## Getting Started

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### User Endpoints

- POST `/register` - User registration
- POST `/login` - User authentication
- GET `/users` - Get user list (admin only)
- GET `/users/:id` - Get user details
- PUT `/users/:id` - Update user details
- DELETE `/users/:id` - Delete user

### Product Endpoints

- GET `/products` - List all products
- GET `/products/:id` - Get product details
- POST `/products` - Create new product (admin only)
- PUT `/products/:id` - Update product (admin only)
- DELETE `/products/:id` - Delete product (admin only)

### Order Endpoints

- POST `/orders` - Create new order
- GET `/orders` - Get order list
- GET `/orders/:id` - Get order details
- PUT `/orders/:id` - Update order status
- PUT `/orders/checkout/:id` - Process order checkout

### Checkout Process

The application implements a robust checkout system with the following features:

1. **Cart to Checkout Flow**

   - Users can select multiple orders from their cart
   - System validates order selection
   - Calculates total price for selected items

2. **Checkout Processing**

   - Secure checkout endpoint with JWT authentication
   - Handles multiple order checkouts simultaneously
   - Updates order status automatically
   - Real-time inventory management

3. **Post-Checkout**
   - Automatic cart update after successful checkout
   - Redirect to cart page with success message
   - Order history update
   - Error handling for failed checkouts

## Security Features

- CORS protection with whitelisted domains
- JWT authentication
- Password hashing
- Protected routes
- Error boundary implementation
- Input validation and sanitization

## Error Handling

- Global error handling middleware
- Custom error responses
- Client-side error boundary
- Form validation
- API error handling

## Additional Features

- Image upload and storage
- Shopping cart persistence
- Order history tracking
- Admin dashboard
- User role management
- Responsive design
- Page transitions and animations
- Multi-item checkout process
- Real-time price calculation
- Order status tracking
- Inventory management during checkout

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MySQL
  - JWT
  - Multer (file upload)
  - Cookie-parser
  - CORS
- Frontend:
  - React.js
  - React Router
  - Axios
  - React Transition Group
  - CSS3
  - HTML5

## Best Practices

- RESTful API design
- Component-based architecture
- Secure authentication flow
- Responsive UI/UX
- Code organization and modularity
- Error handling and validation
