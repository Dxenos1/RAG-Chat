import json
from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from src.qdrant import upload_website_to_collection
from src.rag import async_get_answer_and_docs, get_answer_and_docs
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="FastAPI Demo", description="A simple RAG app")

orgins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://rag-demo-ruby.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=orgins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Message(BaseModel):
    message: str


@app.websocket("/async_chat")
async def async_chat(websocket: WebSocket):
    await websocket.accept()
    while True:
        question = await websocket.receive_text()
        async for event in async_get_answer_and_docs(question):
            if event["event_type"] == "done":
                await websocket.close()
                return
            else:
                await websocket.send_text(json.dumps(event))


@app.post("/chat", description="Chat with the RAG API through this endpoint", tags=["chat"])
def chat(body: Message):
    response = get_answer_and_docs(body.message)
    response_content = {
        "question": body.message,
        "answer": response["answer"],
        "documents": [doc.dict() for doc in response["context"]]
    }
    return JSONResponse(content=response_content, status_code=200)


@app.post("/indexing", description="Index a website through this endpoint", tags=["indexing"])
def indexing(url: str):
    try:
        response = upload_website_to_collection(url)
        return JSONResponse(content={"response": response}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
