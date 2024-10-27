# ECommerce Platform

An eCommerce web application built with React for the frontend and Flask for the backend. This platform allows users to browse products, add them to a cart, and place orders. Administrators can manage users, products, and orders through an admin interface.

## Features

### User Features
- **Browse Products**: View a list of available products, including details like name, price, and description.
- **Add to Cart**: Add products to a shopping cart, view, and modify cart items.
- **Order Placement**: Complete orders by providing shipping information and confirming the order.
- **Authentication**: Register and log in to save cart items and view order history.
  
### Admin Features
- **User Management**: View a list of all users, with options to edit or delete users as necessary.
- **Product Management**: Add, update, or remove products from the catalog.
- **Order Management**: View, update, and manage orders placed by users.

## Project Structure

### Frontend (React)
The frontend is built using React and styled with CSS. Key components include:

- `App.js`: Main entry point, sets up routing.
- `Layout.js`: Core layout component, manages navigation and footer.
- `ProductsPage.js`: Displays a list of products.
- `ProductCard.js`: Component for displaying individual product details.
- `CartPage.js`: Displays the user's cart items.
- `OrderSummary.js`: Shows order details and total price.
- `AdminPage.js`: Provides admin interface for managing users, products, and orders.

### Backend (Flask)
The backend is structured as a REST API with the following endpoints:

- **Authentication**:
  - `POST /api/auth/login`: Log in an existing user.
  - `POST /api/auth/register`: Register a new user.
- **Products**:
  - `GET /api/products`: Get a list of products.
  - `POST /api/products`: Add a new product (admin only).
  - `PUT /api/products/<id>`: Update an existing product (admin only).
  - `DELETE /api/products/<id>`: Delete a product (admin only).
- **Cart**:
  - `GET /api/cart`: Retrieve the current user's cart.
  - `POST /api/cart/add`: Add an item to the cart.
  - `POST /api/cart/remove`: Remove an item from the cart.
- **Orders**:
  - `POST /api/orders`: Place a new order.
  - `GET /api/orders`: Get the user’s order history.
  - `GET /api/orders/<id>`: Get details of a specific order.
  - `PUT /api/orders/<id>`: Update an order status (admin only).

### Database
The backend uses a relational database (e.g., PostgreSQL or SQLite) for storing user, product, and order data. SQLAlchemy ORM manages database operations.

### Authentication and Authorization
User authentication is managed using JSON Web Tokens (JWT). The `@login_required` and `@admin_required` decorators ensure that routes are protected and only accessible by authorized users.

## Installation

### Prerequisites
- Node.js and npm for the frontend
- Python 3.8+ and Flask for the backend
- PostgreSQL (optional, if not using SQLite)

### Frontend Setup

1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev


### Backend Setup

1. Navigate to the backend directory:
   cd backend

2. Create a virtual environment:
   python -m venv venv
   source venv/bin/activate

3. Install dependencies:
   pip install -r requirements.txt

4. Set up the database:
   - Update `config.py` with your database credentials.
   - Run migrations to set up tables:
     flask db upgrade

5. Start the Flask server:
   flask run

## Dependencies

### Frontend
- **React**: For UI components.
- **React Router**: For client-side routing.
- **React Toastify**: For user notifications and feedback.

### Backend
- **Flask**: Web framework for creating REST APIs.
- **Flask-JWT-Extended**: For JWT-based authentication.
- **Flask-SQLAlchemy**: ORM for database management.
- **Flask-Migrate**: For handling database migrations.
- **Flask-CORS**: For handling cross-origin requests from the frontend.

## Testing

### Frontend
Use `Jest` and `React Testing Library` to test individual components and simulate user interactions.

### Backend
Use `pytest` to test API endpoints, covering authentication, product management, and order creation. Configure tests to run with a temporary in-memory database.

**ENJOY**