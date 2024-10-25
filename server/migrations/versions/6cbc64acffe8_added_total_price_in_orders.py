"""Added total price in orders.

Revision ID: 6cbc64acffe8
Revises: 4d5184b79654
Create Date: 2024-10-24 12:57:36.381147

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6cbc64acffe8'
down_revision = '4d5184b79654'
branch_labels = None
depends_on = None


def upgrade():
    # Remove the line that drops the temporary table if it doesn't exist
    # op.drop_table('_alembic_tmp_order_products')  # This line is removed

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_price', sa.Float(), nullable=True))  # Initially allow NULL

    # Optionally: Update existing rows to have a default value
    op.execute("UPDATE orders SET total_price = 0.0 WHERE total_price IS NULL")

    # Uncomment this section after you run the migration once to set the column to NOT NULL
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.alter_column('total_price', nullable=False)


def downgrade():
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_column('total_price')
