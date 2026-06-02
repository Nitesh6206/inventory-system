from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.crud import order_crud
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter()

@router.post("/", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await order_crud.create(db, order)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/", response_model=list[OrderResponse])
async def get_orders(db: AsyncSession = Depends(get_db)):
    return await order_crud.get_all(db)

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)):
    return await order_crud.get(db, order_id)


@router.delete("/{order_id}")
async def cancel_order(order_id: int, db: AsyncSession = Depends(get_db)):
    await order_crud.delete(db, order_id)
    return {"detail": "Order deleted successfully"}