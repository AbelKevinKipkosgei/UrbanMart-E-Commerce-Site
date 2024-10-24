from flask import jsonify, make_response, request
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from flask_restful import Resource
from models import User, Product, Order
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
    unrestricted_routes = ['login', 'signup', 'home', 'publicproductresource', 'static']
    if request.endpoint not in unrestricted_routes and not current_user.is_authenticated:
        return make_response(jsonify({'error': 'Unauthorized access'}), 401)

# Signup Resource
class SignupResource(Resource):
    def post(self):
        data = request.get_json()

        # Validate incoming data
        errors = {}

        if not data.get('username'):
            errors['username'] = 'Username is required.'
        if not data.get('password'):
            errors['password'] = 'Password is required.'
        if not data.get('password_confirmation'):
            errors['password_confirmation'] = 'Password confirmation is required.'

        if errors:
            return make_response(jsonify({'error': errors}), 422)

        if data['password'] != data['password_confirmation']:
            return make_response(jsonify({'error': {'password_confirmation': 'Passwords do not match.'}}), 422)

        if User.query.filter_by(username=data['username']).first():
            return make_response(jsonify({'error': {'username': 'Username already exists.'}}), 400)

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
        if not data.get('name') or not data.get('price') or not data.get('image_url'):
            return make_response(jsonify({'error': 'Product name, price, and image URL are required.'}), 400)

        new_product = Product(
            name=data['name'],
            price=data['price'],
            image_url=data['image_url'],
            description=data.get('description', '')
        )
        db.session.add(new_product)
        db.session.commit()
        return make_response(jsonify(new_product.to_dict()), 201)

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
api.add_resource(PromoteUserResource, '/admin/promote/<int:user_id>')
api.add_resource(DemoteUserResource, '/admin/demote/<int:user_id>')
api.add_resource(HomeResource, '/')
api.add_resource(PublicProductResource, '/products')
api.add_resource(OrderResource, '/orders')
api.add_resource(CartResource, '/cart')
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
