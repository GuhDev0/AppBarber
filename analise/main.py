
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controller.analiseBarberiaControler import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
