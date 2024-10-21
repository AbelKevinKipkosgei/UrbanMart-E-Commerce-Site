from flask import jsonify, make_response, request, session
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from flask_admin import Admin
from flask_restful import Resource
from models import User, Product, Order
from config import app, db, api

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = "Please log in to access this page."

# Initialize Flask-Admin
admin = Admin(app, name='Admin Panel', template_mode='bootstrap3')

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
    def get(self):
        if not current_user.is_authenticated or current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)

    def post(self):
        data = request.get_json()
        if 'username' not in data or 'password' not in data or 'password_confirmation' not in data:
            return make_response(jsonify({'error': 'Missing fields'}), 422)

        if data['password'] != data['password_confirmation']:
            return make_response(jsonify({'error': 'Passwords do not match'}), 422)

        if User.query.filter_by(username=data['username']).first():
            return make_response(jsonify({'error': 'Username already exists'}), 400)

        new_user = User(
            username=data['username'],
            role=data.get('role', 'user'),
            bio=data.get('bio', 'A new user finding their way.')
        )
        new_user.password = data['password']

        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify({'message': 'Signup successful!'}), 201)

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

    @login_required
    def put(self):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)

        data = request.get_json()
        product = Product.query.get(data['id'])
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)

        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.image_url = data.get('image_url', product.image_url)
        product.description = data.get('description', product.description)

        db.session.commit()
        return make_response(jsonify(product.to_dict()), 200)

    @login_required
    def delete(self):
        if current_user.role != 'admin':
            return make_response(jsonify({'error': 'Unauthorized access'}), 403)

        data = request.get_json()
        product = Product.query.get(data['id'])
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)

        db.session.delete(product)
        db.session.commit()
        return make_response(jsonify({'message': 'Product deleted'}), 200)
    
class HomeResource(Resource):
    def get(self):
        return make_response(jsonify({'message': 'Welcome to the API'}), 200)

  
# Public Product Resource (Accessible to Everyone)
class PublicProductResource(Resource):
    def get(self):
        products = [product.to_dict() for product in Product.query.all()]
        return make_response(jsonify(products), 200)

# Order Resource
class OrderResource(Resource):
    @login_required
    def get(self):
        user_orders = Order.query.filter_by(user_id=current_user.id).all()
        orders_data = [order.to_dict() for order in user_orders]
        return make_response(jsonify(orders_data), 200)

# Cart Resource
class CartResource(Resource):
    @login_required
    def get(self):
        user_orders = Order.query.filter_by(user_id=current_user.id).all()
        cart_items = [order.to_dict() for order in user_orders]
        return make_response(jsonify(cart_items), 200)

# User Login Status Authentication
class AuthStatus(Resource):
    def get(self):
        if 'user_id' in session:
            # If the user is authenticated, get the user's role
            user_role = session.get('role', 'user')

            # Return authenticated status along with user's role
            return {"authenticated": True, "role": user_role}, 200
        else:
            # If the user is not authenticated, return a 401 Unauthorized
            return {"authenticated": False, "message": "User not authenticated"}, 401

# Login and Logout Endpoints
class AuthResource(Resource):
    def post(self):
        data = request.get_json()

        # Validate incoming data
        if not data or 'username' not in data or 'password' not in data:
            return make_response(jsonify({'error': 'Missing fields'}), 422)

        user = User.query.filter_by(username=data['username']).first()

        if not user or not user.authenticate(data['password']):
            return make_response(jsonify({'error': 'Invalid credentials'}), 401)

        # Log in the user and set the session
        login_user(user)

        # Store the user ID in the session for persistence
        session['user_id'] = user.id

        return make_response(jsonify({'message': 'Login successful!'}), 200)

class LogoutResource(Resource):
    @login_required
    def post(self):
        logout_user()

        # Clear any session data, user_id and role
        session.pop('user_id', None)
        session.pop('role', None)

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

# Registering the resources with Flask-RESTful
api.add_resource(SignupResource, '/signup')
api.add_resource(UserResource, '/admin/users')
api.add_resource(ProductResource, '/admin/products')
api.add_resource(PromoteUserResource, '/admin/promote/<int:user_id>')
api.add_resource(HomeResource, '/')
api.add_resource(PublicProductResource, '/products')
api.add_resource(OrderResource, '/orders')
api.add_resource(CartResource, '/cart')
api.add_resource(AuthResource, '/login', endpoint='login')
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
