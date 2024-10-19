from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from config import db

# Association table for many-to-many relationship
user_product = db.Table(
    'user_products',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('product_id', db.Integer, db.ForeignKey('products.id'))
)

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)

    # Relationship mapping product to users
    users = db.relationship('User', secondary=user_product, back_populates='products')

    # Serialization rules
    serialize_rules = ('-users.products',)

    def __repr__(self):
        return f'<Product ID: {self.id}, Name: {self.name}, Price: {self.price}>'
    
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False, default='user')
    bio = db.Column(db.String, nullable=False, default='A new user who is still trying to find their way around.')

    # Relationship mapping user to products
    products = db.relationship('Product', secondary=user_product, back_populates='users')

    # Serialization rules
    serialize_rules = ('-products.users',)

    # Password encryption
    @hybrid_property
    def password(self):
        raise AttributeError('Password is not accessible')
    
    @password.setter
    def password(self, password):
        # Hash the password using werkzeug.security
        self._password_hash = generate_password_hash(password)
    
    # Authenticator
    def authenticate(self, password):
        # Verify the password using werkzeug.security
        return check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f'User ID: {self.id}, Username: {self.username}, Role: {self.role}>'
