from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate

class CustomerCRUD:
    async def create(self, db: AsyncSession, customer_in: CustomerCreate):
        db_customer = Customer(**customer_in.dict())
        db.add(db_customer)
        await db.commit()
        await db.refresh(db_customer)
        return db_customer

    async def get_all(self, db: AsyncSession):
        result = await db.execute(select(Customer))
        return result.scalars().all()

customer_crud = CustomerCRUD()