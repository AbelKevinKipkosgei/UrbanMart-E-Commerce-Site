"""Added a new OrderProduct model.

Revision ID: 4d5184b79654
Revises: 509eb4950820
Create Date: 2024-10-24 07:52:00.250008

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '4d5184b79654'
down_revision = '509eb4950820'
branch_labels = None
depends_on = None

def upgrade():
    # Drop the existing order_products table if it exists
    op.drop_table('order_products')

    # Create a new order_products table with the required schema
    op.create_table(
        'order_products',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('order_id', sa.Integer(), sa.ForeignKey('orders.id'), nullable=False),
        sa.Column('product_id', sa.Integer(), sa.ForeignKey('products.id'), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False)
    )


def downgrade():
    # Drop the order_products table
    op.drop_table('order_products')
