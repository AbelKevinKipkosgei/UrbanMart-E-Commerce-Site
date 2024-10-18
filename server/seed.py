# import random
# from random import choice as rc
# from faker import Faker
# from models import Product, User
# from config import db, app

# faker = Faker()


# def seed_products():
#     # Clear products table
#     Product.query.delete()
#     db.session.commit()

#     products = [
#         {
#             "name": "Chrysanthemum",
#             "price": 5.30,
#             "description": "A beautiful Chrysanthemum flower",
#             "image_filename": "chrysanthemum.jpg"
#         },
#         {
#             "name": "Hibiscus",
#             "price": 4.50,
#             "description": "A lovely Hibiscus flower",
#             "image_filename": "hibiscus.jpg"
#         },
#         {
#             "name": "Lotus",
#             "price": 6.00,
#             "description": "A stunning Lotus flower",
#             "image_filename": "lotus.jpg"
#         },
#         {
#             "name": "Marguerite",
#             "price": 3.75,
#             "description": "A charming Marguerite flower",
#             "image_filename": "marguerite.jpg"
#         },
#         {
#             "name": "Rose",
#             "price": 7.50,
#             "description": "A beautiful Rose flower",
#             "image_filename": "rose.jpg"
#         },
#         {
#             "name": "Wheat Flower",
#             "price": 2.50,
#             "description": "A lovely Wheat Flower",
#             "image_filename": "wheatflower.jpg"
#         }
#     ]

#     base_url = 'http://127.0.0.1:5555/'
#     image_file_path = 'server/static/images/products/'

#     product_instances = [
#         Product(
#             name=product['name'],
#             price=product['price'],
#             image_url=f'{base_url}{image_file_path}{product["image_filename"]}',
#             description=product['description'],
#         )
#         for product in products
#     ]

#     db.session.add_all(product_instances)
#     db.session.commit()

#     return product_instances

# def seed_users(product_instances):
#     # Clear users table
#     User.query.delete()
#     db.session.commit()

#     # Seed users
#     users = []
#     roles = ['user','admin']
#     for _ in range(10):
#         # Create user instance
#         user = User(
#             username=faker.user_name(),
#             role=random.choice(roles),
#             bio=faker.text(max_nb_chars=50)
#         )

#         password=faker.password()
#         user.password_hash=password

#         num_products = random.randint(1, 3)
#         assigned_products = random.sample(product_instances, num_products)

#         for product in assigned_products:
#             user.products.append(product)

#         users.append(user)

#     db.session.add_all(users)
#     db.session.commit()

#     return 'Database seeded successfully'

# if __name__ == '__main__':
#     with app.app_context():
#         product_instances = seed_products()
#         # seed users after seeding products
#         seed_users(product_instances)
import random
from random import choice as rc
from faker import Faker
from models import Product, User
from config import db, app

faker = Faker()

def seed_products():
    # Clear products table
    Product.query.delete()
    db.session.commit()

    products = [
        {
            "name": "Chrysanthemum",
            "price": 5.30,
            "description": "A beautiful Chrysanthemum flower",
            "image_filename": "chrysanthemum.jpg"
        },
        {
            "name": "Hibiscus",
            "price": 4.50,
            "description": "A lovely Hibiscus flower",
            "image_filename": "hibiscus.jpg"
        },
        {
            "name": "Lotus",
            "price": 6.00,
            "description": "A stunning Lotus flower",
            "image_filename": "lotus.jpg"
        },
        {
            "name": "Marguerite",
            "price": 3.75,
            "description": "A charming Marguerite flower",
            "image_filename": "marguerite.jpg"
        },
        {
            "name": "Rose",
            "price": 7.50,
            "description": "A beautiful Rose flower",
            "image_filename": "rose.jpg"
        },
        {
            "name": "Wheat Flower",
            "price": 2.50,
            "description": "A lovely Wheat Flower",
            "image_filename": "wheatflower.jpg"
        }
    ]

    product_instances = [
        Product(
            name=product['name'],
            price=product['price'],
            image_url=f'http://127.0.0.1:5555/static/images/products/{product["image_filename"]}',
            description=product['description'],
        )
        for product in products
    ]

    db.session.add_all(product_instances)
    db.session.commit()

    return product_instances

def seed_users(product_instances):
    # Clear users table
    User.query.delete()
    db.session.commit()

    # Seed users
    users = []
    roles = ['user', 'admin']
    for _ in range(10):
        # Create user instance
        user = User(
            username=faker.user_name(),
            role=random.choice(roles),
            bio=faker.text(max_nb_chars=50)
        )

        password = faker.password()
        user.password_hash = password

        num_products = random.randint(1, 3)
        assigned_products = random.sample(product_instances, num_products)

        for product in assigned_products:
            user.products.append(product)

        users.append(user)

    db.session.add_all(users)
    db.session.commit()

    return 'Database seeded successfully'

if __name__ == '__main__':
    with app.app_context():
        product_instances = seed_products()
        # Seed users after seeding products
        seed_users(product_instances)
