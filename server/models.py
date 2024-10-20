from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, metadata

# Association table for many-to-many relationship between products and orders
order_product = db.Table(
    'order_products',
    metadata,
    db.Column('product_id', db.Integer, db.ForeignKey('products.id')),
    db.Column('order_id', db.Integer, db.ForeignKey('orders.id'))
)

class User(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False, default='user')
    bio = db.Column(db.String, nullable=False, default='A new user who is still trying to find their way around.')

    # Relationship mapping user to orders
    orders = db.relationship('Order', back_populates='user', cascade='all, delete-orphan')

    # Relationship mapping user to products
    products = association_proxy('orders', 'product', creator=lambda product_obj: Order(product=product_obj))

    # Serialization rules
    serialize_rules = ('-orders.user',)

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
    
    # Flask-Login method to determine if the user is active
    @property
    def is_active(self):
        return True

    # Flask-Login method to get the user ID
    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return f'User ID: {self.id}, Username: {self.username}, Role: {self.role}>'


class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)

    # Relationship mapping product to orders
    orders = db.relationship('Order', secondary=order_product,  back_populates='products')

    # Relationship mapping product to users
    users = association_proxy('orders', 'user', creator=lambda user_obj: Order(user=user_obj))

    # Serialization rules
    serialize_rules = ('-orders.products',)

    def __repr__(self):
        return f'<Product ID: {self.id}, Name: {self.name}, Price: {self.price}>'
    
class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationship mapping order to user
    user = db.relationship('User', back_populates='orders')

    # Relationship mapping order to products
    products = db.relationship('Product', secondary=order_product, back_populates='orders')

    # Serialization rules
    serialize_rules = ('-user.orders','-products.orders')
    