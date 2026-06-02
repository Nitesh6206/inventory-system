from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.crud import customer_crud
from app.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter()

@router.post("/", response_model=CustomerResponse)
async def create_customer(customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    return await customer_crud.create(db, customer)

@router.get("/", response_model=list[CustomerResponse])
async def get_customers(db: AsyncSession = Depends(get_db)):
    return await customer_crud.get_all(db)