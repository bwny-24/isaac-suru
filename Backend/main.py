from fastapi import FastAPI, Depends, Path, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models
from models import Todos
from database import engine, SessionLocal
from typing import Annotated, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

app = FastAPI()
TODO_NOT_FOUND = "Todo not found"

# --- Enable CORS for React Frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust port if needed (e.g., http://localhost:5173 for Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

class TodoRequest(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    description: Optional[str] = Field(default="", max_length=10000)
    completed: bool = Field(default=False)

# --- READ ALL ---
@app.get("/todos")
async def read_all(db: db_dependency):
    return db.query(Todos).all()

# --- READ BY ID ---
@app.get("/todos/{todo_id}", responses={404: {"description": TODO_NOT_FOUND}})
async def get_todo_id(db: db_dependency, todo_id: int = Path(gt=0)):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first()
    if todo_result is not None:
        return todo_result
    raise HTTPException(status_code=404, detail=TODO_NOT_FOUND)

# --- CREATE ---
@app.post("/todos", status_code=201)
async def create_todo(db: db_dependency, todo_request: TodoRequest):
    new_todo = Todos(
        title=todo_request.title,
        description=todo_request.description,
        completed=todo_request.completed,
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return {"message": "To-do item successfully created", "data": new_todo}

# --- UPDATE ---
@app.put("/todos/{todo_id}", responses={404: {"description": TODO_NOT_FOUND}})
async def update_todo(db: db_dependency, todo_request: TodoRequest, todo_id: int = Path(gt=0)):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first()
    if todo_result is None:
        raise HTTPException(status_code=404, detail=TODO_NOT_FOUND)
    
    todo_result.title = todo_request.title
    todo_result.description = todo_request.description
    todo_result.completed = todo_request.completed
    
    db.add(todo_result)
    db.commit()
    return {"message": "Todo updated successfully"}

# --- DELETE ---
@app.delete("/todos/{todo_id}", responses={404: {"description": TODO_NOT_FOUND}})
async def delete_todo(db: db_dependency, todo_id: int = Path(gt=0)):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first()
    if todo_result is None:
        raise HTTPException(status_code=404, detail=TODO_NOT_FOUND)
    
    db.delete(todo_result)
    db.commit()
    return {"message": "Deleted successfully"}