
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate

class CustomerCRUD:
    async def create(self, db: AsyncSession, customer_in: CustomerCreate):
        try:

            if customer_in.email:
                existing_customer = await db.execute(select(Customer).where(Customer.email == customer_in.email))
                if existing_customer.scalars().first():
                    raise HTTPException(status_code=400, detail="User with this email already exists")
            db_customer = Customer(**customer_in.dict())
            db.add(db_customer)
            await db.commit()
            await db.refresh(db_customer)
            return db_customer
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))   

    async def get_all(self, db: AsyncSession):
        result = await db.execute(select(Customer))
        return result.scalars().all()

customer_crud = CustomerCRUD()