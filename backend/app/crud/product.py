from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.product import Product
from app.schemas.product import ProductCreate

class ProductCRUD:
    async def create(self, db: AsyncSession, product_in: ProductCreate):
        db_product = Product(**product_in.dict())
        db.add(db_product)
        await db.commit()
        await db.refresh(db_product)
        return db_product

    async def get_all(self, db: AsyncSession, skip: int = 0, limit: int = 100):
        result = await db.execute(select(Product).offset(skip).limit(limit))
        return result.scalars().all()
    
    async def get(self, db: AsyncSession, product_id: int):
        return await db.get(Product, product_id)
    
    async def update(self, db: AsyncSession, product_id: int, product_in: ProductCreate):
        db_product = await db.get(Product, product_id)
        if not db_product:
            return None
        for key, value in product_in.dict().items():
            setattr(db_product, key, value)
        await db.commit()
        await db.refresh(db_product)
        return db_product
    
    async def delete(self, db: AsyncSession, product_id: int):
        db_product = await db.get(Product, product_id)
        if not db_product:
            return None
        await db.delete(db_product)
        await db.commit()
        return db_product

product_crud = ProductCRUD()