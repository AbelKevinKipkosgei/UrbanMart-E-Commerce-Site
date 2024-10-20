from models import Product, User, Order
from config import db, app

def clear_tables():
    # Clear tables in a specific order to avoid foreign key constraint issues
    Order.query.delete()
    Product.query.delete()
    User.query.delete()
    db.session.commit()

def seed_data():
    # Clear existing data before seeding
    clear_tables()

    # Create lists of users and products
    users = [
        User(username='abel_soi', role='admin', bio='I am the ADMINISTRATOR.'),
        User(username='john_doe', bio='A curious buyer.'),
        User(username='jane_smith', bio='Loves gadgets and electronics.'),
        User(username='alice_wonder', bio='Tech enthusiast and frequent shopper.')
    ]

    # Set passwords for each user
    users[0].password = 'abelsoi254'
    users[1].password = 'password123'
    users[2].password = 'securepass456'
    users[3].password = 'alicepass789'

    products = [
        Product(name='Chrysanthemum', price=5.30, description='A beautiful Chrysanthemum flower', image_url='http://127.0.0.1:5555/static/images/products/chrysanthemum.jpg'),
        Product(name='Hibiscus', price=4.50, description='A lovely Hibiscus flower', image_url='http://127.0.0.1:5555/static/images/products/hibiscus.jpg'),
        Product(name='Lotus', price=6.00, description='A stunning Lotus flower', image_url='http://127.0.0.1:5555/static/images/products/lotus.jpg'),
        Product(name='Marguerite', price=3.75, description='A charming Marguerite flower', image_url='http://127.0.0.1:5555/static/images/products/marguerite.jpg'),
        Product(name='Rose', price=7.50, description='A beautiful Rose flower', image_url='http://127.0.0.1:5555/static/images/products/rose.jpg'),
        Product(name='Red Poppy', price=2.50, description='A lovely Red Poppy flower', image_url='http://127.0.0.1:5555/static/images/products/redpoppy.jpg')
    ]

    # Step 2: Add users and products to the session
    db.session.add_all(users + products)
    db.session.commit()

    # Step 3: Create orders and link users to products and vice versa using association proxies

    johns_order_1 = Order(user=users[1], products=[products[0], products[1]])
    janes_order_1 = Order(user=users[2], products=[products[2]])
    alices_order_1 = Order(user=users[3], products=[products[1], products[3]])
    johns_order_2 = Order(user=users[1], products=[products[3]])
    janes_order_2 = Order(user=users[2], products=[products[2], products[5]])
    alices_order_2 = Order(user=users[3],  products=[products[0], products[4]])


    # Add orders to the session
    db.session.add_all([johns_order_1, janes_order_1, alices_order_1, johns_order_2, janes_order_2, alices_order_2])
    db.session.commit()

    # Step 5: Verify relationships using queries and print results

    # Query 1: List all orders, the associated user, and the products they ordered
    for order in Order.query.all():
        user = order.user
        product_names = [product.name for product in order.products]
        print(f"User: {user.username}, Ordered Products: {product_names}")

    # Query 2: List all products and the users who purchased them
    for product in Product.query.all():
        product_users = [order.user.username for order in product.orders]
        print(f"Product: {product.name}, Purchased by: {product_users}")

    # Query 3: List all users and the products they have ordered
    for user in User.query.all():
        user_products = [product.name for order in user.orders for product in order.products]
        print(f"User: {user.username}, Products Purchased: {user_products}")


if __name__ == '__main__':
    with app.app_context():
        seed_data()
