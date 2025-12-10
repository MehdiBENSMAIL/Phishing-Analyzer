from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailData(BaseModel):
    sender: str
    subject: str
    content: str
    urls: int = 0

@app.post("/predict")
async def predict(email: EmailData):
    #TODO Make the model return the score
    return {"score": 0}

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": True}