from fastapi import FastAPI, Depends, Path, HTTPException
import models
from models import Todos
from database import engine, SessionLocal
from typing import Annotated, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

"""  Books
class BookRequest(BaseModel):
    title: str = Field(min_length=3, max_length=1000)
    author: str = Field(min_length=3, max_length=1000)
    published_year: StrictInt = Field(gt=1800, lt=2026)
    
# To read book data:
@app.get("/books")
async def read_all(db: db_dependency):
    return db.query(Books).all()

@app.get("/books/{book_id}")
async def get_book_by_id(db: db_dependency, book_id: int = Path(get=0)):
    book_result = db.query(Books).filter(Books.id == book_id).first()
    
    if book_result is not None:
        return book_result
    
    raise HTTPException(status_code=404, details = "Book not found")

# To create book data:
@app.post("/books")
async def create_book(db: db_dependency, book_request: BookRequest):
    new_book = Books(title = book_request.title, author=book_request.author, published_year = book_request.published_year)
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return {"message" : "Book successfully updated"}

@app.put("/books/{book_id}")
async def update_book(db: db_dependency,
                      book_id: int,
                      book_request: BookRequest):
    book_result: db.query(Books).filter(Books.id == book_id).first()
    
    if book_result is None:
        raise HTTPException(status_code=404, detail = "no book, nerds")
    
    book_result.title = book_request.title
    book_result.author = book_request.author
    book_result.published_year = book_request.published_year
    
    db.add(book_result)
    db.commit()
    return{"message" : "ur books here, nerd"}

# To delete book data:
@app.delete("/books/{books_id}")
async def delete_book(db: db_dependency, book_id: int = Path(gt=0)):
    book_result = db.query(Books).filter(Books.id == book_id).first()
    
    if book_result is None:
        raise HTTPException(status_code=404, detail="no books, nerd")
    else:
        db.delete(book_request)
        db.commit()
        return{"message": "Ur books gone, nerd"}
    
    

# Change your POST endpoint to handle a list
@app.post("/books/bulk")
async def create_multiple_books(
    db: db_dependency, 
    book_requests: List[BookRequest]
):
    new_books = [
        Books(
            title=book.title, 
            author=book.author, 
            published_year=book.published_year
        )
        for book in book_requests
    ]
    
    db.add_all(new_books)  # Add all objects at once
    db.commit()            # Single commit to the database
    
    return {"message": f"Successfully added {len(new_books)} books"}
    
 """


# to do 

class TodoRequest(BaseModel):
    title : str = Field(min_length=3, max_length=100)
    description : Optional[str] = Field(min_length= 2, max_length= 10000)
    completed : bool = Field(default=False)
    
# --- READ ALL ---
@app.get("/todos")
async def read_all(db: db_dependency):
    return db.query(Todos).all()

# --- READ BY ID ---
@app.get("/todos/{todo_id}", responses={404: {"description": "To-do item not found"}})
async def get_todo_id(db: db_dependency, todo_id: int = Path(gt=0)):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first()
    
    if todo_result is not None:
        return todo_result
    raise HTTPException(status_code=404, detail = "you can procrastinate")


# --- Create ---
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
@app.put("todos/{todo_id}", responses={404: {"description": "To-do item not found"}})
async def update_todo(db: db_dependency, todo_request: TodoRequest, 
                      todo_id: int = Path(gt=0)):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first()
    if todo_result is None:
        raise HTTPException(status_code=404, detail="you can procrastinate")
    
    todo_result.title = todo_request.title
    todo_result.description = todo_request.description
    todo_result.completed = todo_request.completed
    
    db.add(todo_result)
    db.commit()
    return{"message": "get this shit done"}

# --- DELETE ---
@app.delete("todos/{todo_id}", responses={404: {"description": "To-do item not found"}})
async def delete_todo(db: db_dependency, todo_id: int = Path(gt=0)):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first()
    if todo_result is None:
        raise HTTPException(status_code=404, detail ="not to get done")
    
    db.delete(todo_result)
    db.commit()
    return {"message": "deleted"}


    