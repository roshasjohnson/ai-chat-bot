from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()


API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
MODEL = os.getenv("MODEL")

print(f"API_KEY: {API_KEY}")
print(f"BASE_URL: {BASE_URL} ")
print(f"MODEL: {MODEL}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message:str


@app.post("/chat")
async def chat(request: ChatRequest):
    print(request.message)

    client = OpenAI(
        base_url=f"{BASE_URL}",
        api_key=f"{API_KEY}",
        )
    
    try:
 
        completion = client.chat.completions.create(
            model=f"{MODEL}",
            messages=[
                {
                "role": "user",
                "content": f"{request.message}"
                }
            ]
            )
        response = completion.choices[0].message.content
        
        return  {"reply":response}

    except: 
        response = "Error occured try again"
        return {"reply":response}