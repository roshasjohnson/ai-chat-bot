import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mistralai import Mistral
import uvicorn
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = FastAPI()

# Allow CORS for all origins (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

api_key = os.getenv("MISTRAL_API_KEY")
model = "mistral-large-latest"
client = Mistral(api_key=api_key)

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    chat_response = client.chat.complete(
        model=model,
        messages=[{"role": "user", "content": req.message}]
    )
    reply = chat_response.choices[0].message.content
    return {"reply": reply}

# To run your FastAPI app, use the following command in your project directory:
# uvicorn main:app --reload