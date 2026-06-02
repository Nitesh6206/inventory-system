from fastapi import APIRouter

from .endpoints import customers, products, orders

api_router = APIRouter(prefix="/v1")

api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])