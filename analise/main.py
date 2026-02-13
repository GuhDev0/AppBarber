
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controller.analiseBarbeariaControler import router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://app-barber-three.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
