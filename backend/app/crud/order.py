from select import select

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


class OrderCRUD:
    async def create(self, db: AsyncSession, order_in: OrderCreate):
        # Step 1: Validate stock for all items
        for item in order_in.items:
            product = await db.get(Product, item.product_id)
            if not product:
                raise HTTPException(status_code=404, detail=f"Product ID {item.product_id} not found")
            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Insufficient stock for product '{product.name}' (SKU: {product.sku}). Available: {product.stock}"
                )

        # Step 2: Create Order
        db_order = Order(
            customer_id=order_in.customer_id,
            status="pending",
            total=0.0
        )
        db.add(db_order)
        await db.flush()  # Get order ID

        total_amount = 0.0

        # Step 3: Create Order Items + Reduce Stock
        for item in order_in.items:
            product = await db.get(Product, item.product_id)
            
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price
            )
            db.add(order_item)

            total_amount += product.price * item.quantity

            # Reduce stock atomically
            product.stock -= item.quantity

        # Step 4: Update Order
        db_order.total = total_amount
        db_order.status = "completed"

        await db.commit()
        await db.refresh(db_order)
        return db_order
    
    async def get_all(self, db: AsyncSession):
        stmt = select(Order).options(selectinload(Order.items))
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get(self, db: AsyncSession, order_id: int):
        return await db.get(Order, order_id)
    
    async def delete(self, db: AsyncSession, order_id: int):
        db_order = await db.get(Order, order_id)
        if not db_order:
            return None
        await db.delete(db_order)
        await db.commit()
        return db_order

order_crud = OrderCRUD()