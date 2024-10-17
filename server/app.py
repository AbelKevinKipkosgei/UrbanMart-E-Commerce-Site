from flask import jsonify, make_response, request, session
from flask_restful import Resource

from config import app, db, api
from models import Product, User


@app.before_request
def check_log_in_status():
    login_routes = ['check_session', 'logout']
    if request.endpoint in  login_routes:
        if 'user_id' not in session or session['user_id'] is None:
            return make_response(jsonify({'error': 'Please log in'}), 401)
class AllProductsResource(Resource):
    def get(self):
        products = [product.to_dict() for product in Product.query.all()]
        return make_response(jsonify(products), 200)
    
class AllUsersResource(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)
    
class Signup(Resource):
    def post(self):
        data  = request.get_json()
        if ('username' not in data or 'password' not in data and 'password_confirmation' not in data):
            return make_response(jsonify({
                'error': {
                    'message': 'username and password required'
                }
            }), 422)
        
        # Create a new user
        new_user = User(
            username = data.get('username'),
            role = data.get('role'),
            bio  = data.get('bio')
        )

        # Hash password and store it
        new_user.password_hash = data.get('password')

        # Add user to database
        db.session.add(new_user)
        db.session.commit()

        # Save user ID to session
        session['user_id'] = new_user.id

        response = make_response(jsonify({
            'user_id': new_user.id,
            'username': new_user.username,
            'role': new_user.role,
            'bio': new_user.bio
        }),  201)

        return response
    
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')

        if user_id:
            user = User.query.filter(User.id == user_id).first()

            if user:
                return make_response(jsonify({
                    'id': user.id,
                    'username': user.username,
                    'role': user.role,
                    'bio': user.bio
                }), 200)

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return make_response(jsonify({
                'error': {
                    'message': 'Missing credentials'
                }
            }), 400)
        
        user = User.query.filter(User.username == username).first()
        
        # Authenticate user password
        if user is None:
            return make_response(jsonify({
            'error': {
                'message':  'User does not exist'
                }
            }), 401)
        
        if user and not user.authenticate(password):
            return make_response(jsonify({
                'error': {
                    'message': 'Invalid credentials'
                }
            }))
        
        # If authentication succeeds, 
        session['user_id'] = user.id

        return  make_response(jsonify({
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'bio': user.bio
        }), 200)
         
class Logout(Resource):
    def delete(self):
        if 'user_id' in session and session['user_id'] is not None:
            session.pop('user_id', None)
            return make_response(jsonify({}), 204)
    
api.add_resource(AllProductsResource, '/products', endpoint='products')
api.add_resource(AllUsersResource, '/users', endpoint='users') 
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)