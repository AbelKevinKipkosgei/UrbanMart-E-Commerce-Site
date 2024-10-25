from sqlite3 import IntegrityError
import traceback
from flask import jsonify, make_response, request
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from flask_restful import Resource
from models import User, Product, Order, OrderProduct
from config import app, db, api

app.secret_key = 'jf}hbYT6*_mnEy8n}SG=>xcfD5h78Di6'

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = "Please log in to access this page."

# Load user for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Middleware to check login status for routes requiring authentication
@app.before_request
def check_login_status():
    restricted_routes = ['cart', 'orders']
    if request.endpoint in restricted_routes and not current_user.is_authenticated:
        return make_response(jsonify({'error': 'Unauthorized access'}), 401)

# Signup Resource
class SignupResource(Resource):
    def post(self):
        data = request.get_json()

        # Validate incoming data
        errors = {}

        if 'username' not in data or not data['username']:
            errors['username'] = 'Username is required.'
        if 'password' not in data or not data['password']:
            errors['password'] = 'Password is required.'
        if 'password_confirmation' not in data or not data['password_confirmation']:
            errors['password_confirmation'] = 'Password confirmation is required.'

        if errors:
            return make_response(jsonify({'error': errors}), 422)

        if data['password'] != data['password_confirmation']:
            errors['password_confirmation'] = 'Passwords do not match.'
            return make_response(jsonify({'error': errors}), 422)

        if User.query.filter_by(username=data['username']).first():
            errors['username'] = 'Username already exists.'
            return make_response(jsonify({'error': errors}), 400)

        # Create new user
        new_user = User(
            username=data['username'],
            role='user',  # Default role
            bio=data.get('bio', 'A new user finding their way.')
        )
        new_user.password = data['password']  # Use the setter to hash the password

        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify({'message': 'Signup successful!'}), 201)

# User Resource
class UserResource(Resource):
    @login_required
    def get(self):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)
   
# Product Resource
class ProductResource(Resource):
    @login_required
    def get(self):
        products = [product.to_dict() for product in Product.query.all()]
        return make_response(jsonify(products), 200)

    @login_required
    def post(self):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)

        data = request.get_json()
        new_product = Product(
            name=data['name'],
            price=data['price'],
            image_url=data['image_url'],
            description=data['description']
        )
        db.session.add(new_product)
        db.session.commit()
        return make_response(jsonify(new_product.to_dict()), 201)
    
# Edit Product Resource
class EditProduct(Resource):
    @login_required
    def put(self, product_id):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)

        product = Product.query.get(product_id)
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)

        data = request.get_json()
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.image_url = data.get('image_url', product.image_url)
        product.description = data.get('description', product.description)

        db.session.commit()
        return make_response(jsonify(product.to_dict()), 200)
    
# Delete Product Resource
class DeleteProduct(Resource):
    @login_required
    def delete(self, product_id):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)

        product = Product.query.get(product_id)
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)

        # Remove product from all associated orders without deleting the orders
        orders = product.orders
        for order in orders:
            order.products.remove(product)

        # Now it's safe to delete the product itself
        db.session.delete(product)
        db.session.commit()

        return make_response(jsonify({'message': 'Product deleted'}), 200)


# Home Resource
class HomeResource(Resource):
    def get(self):
        return make_response(jsonify({'message': 'Welcome to the API'}), 200)

# Public Product Resource (Accessible to Everyone)
class PublicProductResource(Resource):
    def get(self):
        products = [product.to_dict() for product in Product.query.all()]
        return make_response(jsonify(products), 200)
    
# OrderList Resource
class OrderListResource(Resource):
    def get(self):
        user_id = current_user.id
        orders =  Order.query.filter_by(user_id=user_id).all()
        return make_response(jsonify([order.to_dict() for order in orders]), 200)

# Order Resource
class OrderResource(Resource):
    @login_required  # Ensure the user is logged in
    def post(self):
        data = request.get_json()
        user_id = current_user.id  # Get the current logged-in user's ID
        products_data = data.get('products', [])
        total_price = data.get('totalPrice', 0.0)

        if not products_data:
            return {"error": "Invalid order data."}, 400

        # Create a new Order instance
        new_order = Order(user_id=user_id, total_price=total_price)

        for item in products_data:
            product_id = item.get('product_id')
            quantity = item.get('quantity')

            if not product_id or not quantity:
                return {"error": "Invalid product data."}, 400
            
            # Create a new OrderProduct instance
            order_product = OrderProduct(product_id=product_id, quantity=quantity)
            new_order.products.append(order_product)

        # Persist the order and its products in the database
        try:
            db.session.add(new_order)
            db.session.commit()
            return {"order": new_order.to_dict()}, 201  # Serialize if using SerializerMixin
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
class CancelOrderResource(Resource):
    @login_required
    def delete(self, order_id):
        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found."}, 404
        if order.user_id != current_user.id:
            return {"error": "You are not authorized to cancel this order."}, 403
        db.session.delete(order)
        db.session.commit()
        return {"message": "Order canceled successfully."}, 200
    
# Admin Order Resource
class AdminOrderResource(Resource):
    @login_required
    def get(self):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)
        orders = [order.to_dict() for order in Order.query.all()]
        return make_response(jsonify(orders), 200)
    
# User Login Status Authentication
class AuthStatus(Resource):
    def get(self):
        if current_user.is_authenticated:
            # Return authenticated status along with user's role
            return {"authenticated": True, "role": current_user.role}, 200
        else:
            # If the user is not authenticated
            return {"authenticated": False, "message": "User not authenticated"}, 401

# User Login     
class LoginResource(Resource):
    def post(self):
        data = request.get_json()

        # Validate incoming data
        if not data:
            return make_response(jsonify({'error': 'Request data is missing'}), 400)
        if 'username' not in data or 'password' not in data:
            return make_response(jsonify({'error': 'Username and password are required'}), 422)

        user = User.query.filter_by(username=data['username']).first()

        # Check if the user exists and if the password is correct
        if not user or not user.authenticate(data['password']):
            return make_response(jsonify({'error': 'Invalid username or password'}), 401)

        # Log in the user
        login_user(user)

        # Provide a success response with user information
        return make_response(jsonify({
            'message': 'Login successful!',
            'user_id': user.id,
            'role': user.role
        }), 200)

class LogoutResource(Resource):
    @login_required
    def post(self):
        logout_user()
        return make_response(jsonify({'message': 'Logout successful!'}), 200)

# Admin route to promote a user
class PromoteUserResource(Resource):
    @login_required
    def post(self, user_id):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)

        user = User.query.get(user_id)
        if not user:
            return make_response(jsonify({'error': 'User not found'}), 404)

        user.role = 'admin'
        db.session.commit()
        return make_response(jsonify({'message': f'User {user.username} has been promoted to admin.'}), 200)
    
# Admin route to demote a user
class DemoteUserResource(Resource):
    @login_required
    def post(self, user_id):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)

        user = User.query.get(user_id)
        if not user:
            return make_response(jsonify({'error': 'User not found'}), 404)

        user.role = 'user'
        db.session.commit()
        return make_response(jsonify({'message': f'Admin {user.username} has been demoted to user.'}), 200)

# Registering the resources with Flask-RESTful
api.add_resource(SignupResource, '/signup')
api.add_resource(UserResource, '/admin/users')
api.add_resource(ProductResource, '/admin/products')
api.add_resource(EditProduct, '/admin/products/<int:product_id>')
api.add_resource(DeleteProduct, '/admin/products/<int:product_id>')
api.add_resource(PromoteUserResource, '/admin/promote/<int:user_id>')
api.add_resource(DemoteUserResource, '/admin/demote/<int:user_id>')
api.add_resource(HomeResource, '/')
api.add_resource(PublicProductResource, '/products')
api.add_resource(AdminOrderResource, '/admin/orders')
api.add_resource(OrderResource, '/orders')
api.add_resource(OrderListResource, '/orders')
api.add_resource(CancelOrderResource, '/orders/<int:order_id>')
api.add_resource(LoginResource, '/login', endpoint='login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(AuthStatus, '/user/authenticate')

# Error handling
@app.errorhandler(401)
def unauthorized_error(e):
    return make_response(jsonify({'error': 'Unauthorized access. Please log in.'}), 401)

@app.errorhandler(403)
def forbidden_error(e):
    return make_response(jsonify({'error': 'Forbidden access. Admins only.'}), 403)

# Run the application
if __name__ == '__main__':
    app.run(port=5555, debug=True)
