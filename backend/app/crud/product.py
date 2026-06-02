
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.product import Product
from fastapi import HTTPException
from app.schemas.product import ProductCreate

class ProductCRUD:
    async def create(self, db: AsyncSession, product_in: ProductCreate):

        try:

            if product_in.sku:
                existing_product = await db.execute(select(Product).where(Product.sku == product_in.sku))
                if existing_product.scalars().first():
                    print("Product with this SKU already exists")
                    raise HTTPException(status_code=400, detail="Product with this SKU already exists")
            db_product = Product(**product_in.dict())
            db.add(db_product)
            await db.commit()
            await db.refresh(db_product)
            return db_product
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))


    async def get_all(self, db: AsyncSession, skip: int = 0, limit: int = 100):
        result = await db.execute(select(Product).offset(skip).limit(limit))
        return result.scalars().all()
    
    async def get(self, db: AsyncSession, product_id: int):
        return await db.get(Product, product_id)
    
    async def update(self, db: AsyncSession, product_id: int, product_in: ProductCreate):

        try:

            if product_in.sku:
                existing_product = await db.execute(select(Product).where(Product.sku == product_in.sku))
                if existing_product.scalars().first():
                    raise HTTPException(status_code=400, detail="Product with this SKU already exists")
            db_product = await db.get(Product, product_id)
            if not db_product:
                return None
            for key, value in product_in.dict().items():
                setattr(db_product, key, value)
            await db.commit()
            await db.refresh(db_product)
            return db_product
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    async def delete(self, db: AsyncSession, product_id: int):
        try:
            db_product = await db.get(Product, product_id)
            if not db_product:
                return None
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        await db.delete(db_product)
        await db.commit()
        return db_product

product_crud = ProductCRUD()