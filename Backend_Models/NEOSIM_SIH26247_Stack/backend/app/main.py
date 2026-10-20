from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.storage import init_db
from backend.app.api.routes import router
@asynccontextmanager
async def lifespan(app): init_db(); yield
app=FastAPI(title=settings.app_name,version='0.1.0',description='NEOSIM API scaffold',lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=settings.origins,allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
app.include_router(router,prefix=settings.api_prefix)
@app.get('/health')
def health():return {"status":"ok","service":settings.app_name,"environment":settings.app_env}
