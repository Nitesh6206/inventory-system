from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.crud import product_crud
from app.schemas.product import ProductCreate, ProductResponse

router = APIRouter()

@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    return await product_crud.create(db, product)

@router.get("/", response_model=list[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    return await product_crud.get_all(db)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    return await product_crud.get(db, product_id)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product_in: ProductCreate, db: AsyncSession = Depends(get_db)):
    return await product_crud.update(db, product_id, product_in)

@router.delete("/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    await product_crud.delete(db, product_id)
    return {"detail": "Product deleted successfully"}