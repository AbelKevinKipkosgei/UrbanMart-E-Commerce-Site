from models import Product, User, Order, OrderProduct
from config import db, app

def clear_tables():
    # Clear tables in a specific order to avoid foreign key constraint issues
    db.session.query(OrderProduct).delete()
    db.session.commit()
    db.session.query(Order).delete()
    db.session.commit()
    db.session.query(Product).delete()
    db.session.commit()
    db.session.query(User).delete()
    db.session.commit()

def seed_data():
    # Clear existing data before seeding
    clear_tables()

    # Create lists of users
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

    # Create products
    products = [
        Product(name='Alienware m18 R2 Gaming Laptop', price=2999.99, description='Intel® Core™ i9 14900HX (Up to NVIDIA® GeForce RTX™ 4090)', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m18-mlk/media-gallery/hd/laptop-alienware-m18-r2-hd-perkey-intel-bk-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=522&qlt=100,1&resMode=sharp2&size=522,402&chrss=full'),
        Product(name='Alienware x16 R2 Gaming Laptop', price=2599.99, description='Intel® Core™ Ultra 9 185H (NVIDIA® GeForce RTX™ 4070)', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienwar-x16-mlk/gallery/notebook-alienware-x16-r2-gray-gallery-12.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=681&qlt=100,1&resMode=sharp2&size=681,402&chrss=full'),
        Product(name='Alienware Aurora R16 Gaming Desktop', price=4694.99, description='Intel® Core™ i9 14900KF (NVIDIA® GeForce RTX™ 4090)', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/alienware-desktops/alienware-aurora-r16/media-gallery/liquid/desktop-aw-r16-bk-lqd-cooling-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4500&hei=3800&qlt=100,1&resMode=sharp2&size=4500,3800&chrss=full&imwidth=5000'),
        Product(name='XPS Desktop', price=1949.99, description='14th Gen Intel® Core™ i9-14900 (NVIDIA® GeForce RTX™ 4060 Ti)', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/xps-desktops/xps-8960-tracer/media-gallery/gray/xs8960-csy-00015rf-gy.psd?fmt=png-alpha&pscan=auto&scl=1&wid=2189&hei=3377&qlt=100,1&resMode=sharp2&size=2189,3377&chrss=full&imwidth=5000'),
        Product(name='Alienware Pro Wireless Gaming Headset', price=229.99, description='Professional-grade wireless gaming headset', image_url='https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/headphones/aw-pro-wireless-headset/media-gallery/dark-side-of-the-moon/headset-aw-pro-bk-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=476&wid=395&qlt=100,1&resMode=sharp2&size=395,476&chrss=full'),
        Product(name='Logitech G920 Driving Force Racing Wheel', price=299.99, description='G920 Driving Force is the definitive sim racing wheel', image_url='https://snpi.dell.com/snp/images/products/large/en-us~A8543273/A8543273.jpg'),
        Product(name='ROG Strix SCAR 18 (2024) G834', price=3300.99, description='Intel® Core™ i9 Processor 14900HX and up to NVIDIA® GeForce RTX™ 4090', image_url='https://dlcdnwebimgs.asus.com/gain/29ADB838-6337-4979-9CD7-09ECB34BA05F/w1000/h732'),
        Product(name='ROG Zephyrus G16 (2024) GA605', price=2490.00, description='AMD Ryzen™ AI 9 HX 370 processor​ with AI accelerators and up to an NVIDIA® GeForce RTX™ 4070', image_url='https://dlcdnwebimgs.asus.com/gain/8DF334FA-F7C9-47F4-AE36-ABFC65DE35EB/w1000/h732'),
        Product(name='Titan 18 HX A14V', price=4300.00, description='Intel® Core™ i9 processor 14900HX Up to NVIDIA® GeForce RTX™ 4090 Laptop GPU 16GB GDDR6', image_url='https://asset.msi.com/resize/image/global/product/product_1703504669c2913b8058d9cdac44b65265972ce073.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png'),
        Product(name='Raider 18 HX A14V', price=1899.99, description='Intel® Core™ i9 processor 14900HX NVIDIA® GeForce RTX™ 40 Series GPU', image_url='https://asset.msi.com/resize/image/global/product/product_17035619796dec3cfeb737f6ca4d66e3b9a34a44dc.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png'),
        Product(name='Stealth 18 Mercedes-AMG Motorsport A1V', price=4099.99, description='Intel® Core™ Ultra 9 processor 185H GeForce RTX™ 4080 Laptop GPU 12GB GDDR6', image_url='https://asset.msi.com/resize/image/global/product/product_17163719021aeec41738d8fc4c0aa68d0e0169ac63.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png'),
        Product(name='Vector 17 HX A14V', price=2700.00, description='Intel® Core™ i9 processor 14900HX Up to GeForce RTX™ 4080 Laptop GPU 12GB GDDR6', image_url='https://asset.msi.com/resize/image/global/product/product_1711690951e00759bc491682b119938f371d7bb002.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png'),
        Product(name='MEG Trident X2 14th', price=6000.00, description='Intel® Core™ i9 processor 14900KF Up to MSI GeForce RTX™ 4090 VENTUS 3X E 24G GDDR6X', image_url='https://asset.msi.com/resize/image/global/product/product_172016309252e4eeaa75b78a6f56a682acadce8c72.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png'),
        Product(name='MAG Codex 6 14th', price=2600.00, description='Up to Intel® Core™ i7 processor 14700F Up to GeForce® RTX™ 4070 graphics card', image_url='https://asset.msi.com/resize/image/global/product/product_1720503379ba1b2a571ea9f1887b466f3ce419c4c9.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png'),
        Product(name='MPG Infinite X3 AI 2nd', price=4800.00, description='Up to Intel® Core™ Ultra 9 processor 285K MSI GeForce RTX™ 4090 VENTUS 3X E 24G OC GDDR6X', image_url='https://asset.msi.com/resize/image/global/product/product_1729760259114832d434b0276686063857f3664e01.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png'),
        Product(name='MEG Aegis Ti5 13th', price=4000.00, description='Up to Intel® Core™ i9-13900K Up to MSI GeForce® RTX 4080', image_url='https://asset.msi.com/resize/image/global/product/product_16763382067718ee4143d29ee665aa678fa9acc1f1.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png')
    ]

    # Step 2: Add users and products to the session
    db.session.add_all(users + products)
    db.session.commit()

    # Step 3: Create orders and link users to products using the OrderProduct model
    johns_order_1 = Order(user=users[1])
    johns_order_1.products.append(OrderProduct(product=products[0], quantity=1))
    johns_order_1.products.append(OrderProduct(product=products[1], quantity=2))

    # Calculate total price for John's first order
    johns_order_1.total_price = sum(
        order_product.product.price * order_product.quantity
        for order_product in johns_order_1.products
    )

    janes_order_1 = Order(user=users[2])
    janes_order_1.products.append(OrderProduct(product=products[2], quantity=1))

    # Calculate total price for Jane's first order
    janes_order_1.total_price = sum(
        order_product.product.price * order_product.quantity
        for order_product in janes_order_1.products
    )

    alices_order_1 = Order(user=users[3])
    alices_order_1.products.append(OrderProduct(product=products[1], quantity=1))
    alices_order_1.products.append(OrderProduct(product=products[3], quantity=1))

    # Calculate total price for Alice's first order
    alices_order_1.total_price = sum(
        order_product.product.price * order_product.quantity
        for order_product in alices_order_1.products
    )

    johns_order_2 = Order(user=users[1])
    johns_order_2.products.append(OrderProduct(product=products[3], quantity=1))

    # Calculate total price for John's second order
    johns_order_2.total_price = sum(
        order_product.product.price * order_product.quantity
        for order_product in johns_order_2.products
    )

    janes_order_2 = Order(user=users[2])
    janes_order_2.products.append(OrderProduct(product=products[2], quantity=1))
    janes_order_2.products.append(OrderProduct(product=products[5], quantity=1))

    # Calculate total price for Jane's second order
    janes_order_2.total_price = sum(
        order_product.product.price * order_product.quantity
        for order_product in janes_order_2.products
    )

    alices_order_2 = Order(user=users[3])
    alices_order_2.products.append(OrderProduct(product=products[0], quantity=1))
    alices_order_2.products.append(OrderProduct(product=products[4], quantity=1))

    # Calculate total price for Alice's second order
    alices_order_2.total_price = sum(
        order_product.product.price * order_product.quantity
        for order_product in alices_order_2.products
    )

    # Add orders to the session
    db.session.add_all([johns_order_1, janes_order_1, alices_order_1, johns_order_2, janes_order_2, alices_order_2])
    db.session.commit()

    # Step 5: Verify relationships using queries and print results

    # Query 1: List all orders, the associated user, and the products they ordered
    for order in Order.query.all():
        user = order.user
        product_names = [order_product.product.name for order_product in order.products]
        print(f"User: {user.username}, Ordered Products: {product_names}, Total Price: ${order.total_price:.2f}")

    # Query 2: List all products and the users who purchased them
    for product in Product.query.all():
        product_users = [order_product.order.user.username for order_product in product.orders]
        print(f"Product: {product.name}, Users: {product_users}")

    # Query 3: List all users and the products they have ordered
    for user in User.query.all():
        user_products = [order_product.product.name for order in user.orders for order_product in order.products]
        print(f"User: {user.username}, Products Ordered: {user_products}")

# Main execution
if __name__ == "__main__":
    with app.app_context():
        seed_data()
