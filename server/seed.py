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
        User(username='abel_soi', role='admin', bio='SUPER USER'),
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
        Product(name='Alienware m18 R2 Gaming Laptop', price=2999.99, description='Intel® Core™ i9 14900HX (Up to NVIDIA® GeForce RTX™ 4090)', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m18-mlk/media-gallery/hd/laptop-alienware-m18-r2-hd-perkey-intel-bk-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=522&qlt=100,1&resMode=sharp2&size=522,402&chrss=full'),
        Product(name='Alienware x16 R2 Gaming Laptop', price=2599.99, description='Intel® Core™ Ultra 9 185H (NVIDIA® GeForce RTX™ 4070)', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienwar-x16-mlk/gallery/notebook-alienware-x16-r2-gray-gallery-12.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=681&qlt=100,1&resMode=sharp2&size=681,402&chrss=full'),
        Product(name='Alienware Aurora R16 Gaming Desktop', price=4694.99, description='Intel® Core™ i9 14900KF (NVIDIA® GeForce RTX™ 4090)', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/alienware-desktops/alienware-aurora-r16/media-gallery/liquid/desktop-aw-r16-bk-lqd-cooling-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4500&hei=3800&qlt=100,1&resMode=sharp2&size=4500,3800&chrss=full&imwidth=5000'),
        Product(name='XPS Desktop', price=1949.99,description='14th Gen Intel® Core™ i9-14900 (NVIDIA® GeForce RTX™ 4060 Ti)', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/xps-desktops/xps-8960-tracer/media-gallery/gray/xs8960-csy-00015rf-gy.psd?fmt=png-alpha&pscan=auto&scl=1&wid=2189&hei=3377&qlt=100,1&resMode=sharp2&size=2189,3377&chrss=full&imwidth=5000'),
        Product(name='Alienware Pro Wireless Gaming Headset', price=229.99, description='Professional-grade wireless gaming headset', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/headphones/aw-pro-wireless-headset/media-gallery/dark-side-of-the-moon/headset-aw-pro-bk-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=476&wid=395&qlt=100,1&resMode=sharp2&size=395,476&chrss=full'),
        Product(name='Logitech G920 Driving Force Racing Wheel', price=299.99, description='G920 Driving Force is the definitive sim racing wheel', image_url='https://snpi.dell.com/snp/images/products/large/en-us~A8543273/A8543273.jpg')
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
