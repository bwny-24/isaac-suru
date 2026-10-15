from database import Base
from sqlalchemy import Column, Integer, String, Boolean, null

""" class Books(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    published_year = Column(Integer)
    
 """


class Todos(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key= True, index= True )
    title = Column(String, nullable=False)
    description = Column(String)
    completed = Column(Boolean, default = False)
    

    
    
    