from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from app.core.config import settings
from app.core.database import engine, Base
from app.models.user import User
from app.core.database import SessionLocal
from app.core.security import hash_password

def create_database_if_not_exists():
    db_url = make_url(settings.DATABASE_URL)
    db_name = db_url.database
    
    # URL to connect to default 'postgres' database
    postgres_url = db_url.set(database="postgres")
    
    # Connect with autocommit to execute CREATE DATABASE statement
    temp_engine = create_engine(postgres_url, isolation_level="AUTOCOMMIT")
    
    with temp_engine.connect() as conn:
        from sqlalchemy import text
        # Check if database exists
        result = conn.execute(
            text(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'")
        ).fetchone()
        
        if not result:
            print(f"Database '{db_name}' does not exist. Creating...")
            conn.execute(text(f"CREATE DATABASE {db_name}"))
            print(f"Database '{db_name}' created successfully.")
        else:
            print(f"Database '{db_name}' already exists.")
            
    temp_engine.dispose()

def init_db():
    try:
        create_database_if_not_exists()
    except Exception as e:
        print(f"Warning during database check/creation: {e}")
        
    print("Creating database tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if default user exists, if not seed
        user = db.query(User).filter(User.email == "contoh@freshvitality.com").first()
        if not user:
            print("Seeding default user: contoh@freshvitality.com")
            default_user = User(
                email="contoh@freshvitality.com",
                nama_user="Pemilik Toko",
                password=hash_password("password123")  # At least 8 characters
            )
            db.add(default_user)
            db.commit()
            print("Database seeding completed.")
        else:
            print("Default user already exists.")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
