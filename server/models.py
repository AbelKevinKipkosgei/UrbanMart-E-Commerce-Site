from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, metadata

class User(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False, default='user')
    bio = db.Column(db.String, nullable=False, default='A new user who is still trying to find their way around.')

    # Relationship mapping user to orders
    orders = db.relationship('Order', back_populates='user', cascade='all, delete-orphan')

    # Association proxy to access products directly
    products = association_proxy('orders', 'products', creator=lambda product_obj, qty: OrderProduct(product=product_obj, quantity=qty))

    # Serialization rules
    serialize_rules = ('-orders.user',)

    # Password encryption
    @hybrid_property
    def password(self):
        raise AttributeError('Password is not accessible')
    
    @password.setter
    def password(self, password):
        self._password_hash = generate_password_hash(password)
    
    # Authenticator
    def authenticate(self, password):
        return check_password_hash(self._password_hash, password)
    
    # Flask-Login method to determine if the user is active
    @property
    def is_active(self):
        return True

    # Flask-Login method to get the user ID
    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return f'User ID: {self.id}, Username: {self.username}, Role: {self.role}'


class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)

    # Relationship mapping product to orders through OrderProduct
    orders = db.relationship('OrderProduct', back_populates='product')

    # Association proxy to access users directly
    users = association_proxy('orders', 'user', creator=lambda user_obj: OrderProduct(user=user_obj))

    # Serialization rules
    serialize_rules = ('-orders.product',)

    def __repr__(self):
        return f'<Product ID: {self.id}, Name: {self.name}, Price: {self.price}>'


class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_price = db.Column(db.Float, nullable=False, default=0.0)

    # Relationship mapping order to user
    user = db.relationship('User', back_populates='orders')

    # Relationship mapping order to products through OrderProduct
    products = db.relationship('OrderProduct', back_populates='order', cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-user.orders', '-products.order')

    def __repr__(self):
        return f'<Order ID: {self.id}, User ID: {self.user_id}, Total Price: {self.total_price}>'



class OrderProduct(db.Model, SerializerMixin):
    __tablename__ = 'order_products'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    # Relationship mapping order product to order
    order = db.relationship('Order', back_populates='products')
    
    # Relationship mapping order product to product
    product = db.relationship('Product', back_populates='orders')

    # Serialization rules
    serialize_rules = ('-order.products', '-product.orders')

    def __repr__(self):
        return f'<OrderProduct ID: {self.id}, Order ID: {self.order_id}, Product ID: {self.product_id}, Quantity: {self.quantity}>'
