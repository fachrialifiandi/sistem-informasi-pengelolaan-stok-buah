from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from datetime import datetime
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.supplier import Supplier
from app.models.buah import Buah
from app.models.transaksi import Transaksi
from app.models.transaksi_detail import TransaksiDetail
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
        
    print("Dropping existing database tables to ensure clean schema update...")
    try:
        Base.metadata.drop_all(bind=engine)
    except Exception as drop_err:
        print(f"Warning during drop_all: {drop_err}")
        
    print("Creating database tables...")
    # Import all models to ensure metadata is registered
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Seed Owner Users
        user = db.query(User).filter(User.email == "contoh@freshvitality.com").first()
        if not user:
            print("Seeding default owner user...")
            default_user = User(
                email="contoh@freshvitality.com",
                nama_user="Pemilik Toko",
                password=hash_password("password123"),
                recovery_key="RECOVERY"
            )
            db.add(default_user)
            
        user2 = db.query(User).filter(User.email == "fachrialifiandi@gmail.com").first()
        if not user2:
            print("Seeding user: fachrialifiandi@gmail.com...")
            default_user2 = User(
                email="fachrialifiandi@gmail.com",
                nama_user="Muhamad",
                password=hash_password("password123"),
                recovery_key="RECOVERY"
            )
            db.add(default_user2)
        db.flush()

        # 2. Seed Suppliers
        if db.query(Supplier).count() == 0:
            print("Seeding default suppliers list...")
            suppliers = [
                Supplier(nama_supplier="Sinar Jaya Orchards", no_telp="08123456789"),
                Supplier(nama_supplier="Mitra Tani Sejahtera", no_telp="08234567890"),
                Supplier(nama_supplier="Kebun Segar Abadi", no_telp="08345678901"),
                Supplier(nama_supplier="Import Fruit Hub", no_telp="08456789012")
            ]
            db.add_all(suppliers)
            db.flush()

        # 3. Seed Fruits Inventory
        if db.query(Buah).count() == 0:
            print("Seeding default fruits list...")
            fruits = [
                Buah(
                    nama_buah="Apel Fuji",
                    sku="1042",
                    current_stock=124.5,
                    unit="kg",
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r"
                ),
                Buah(
                    nama_buah="Pisang Ambon",
                    sku="2012",
                    current_stock=0.0,
                    unit="kg",
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuAPcApLrxFvNPvGVQ-vMjePGebTERdjEp5Qip9BJPdnsPVd_tjDfY-i_uFeFSmp9W9puZ8kVldnxbbR3tqPuiJY69mqCFtOsnrfFIgdFUHuFb1tmcrRyYh_B-T_gAyDAGCFC6j1SJRQK9bjYtuTCj3jcXoyEgVXsQlGq25IrmhgIGDsy_8qgH7LNAakNPzbzZ-9vcnl-B7leFyaXICWTAajvfOEXrCg9NV8okDpuJnm4TNCUWsKV4TB"
                ),
                Buah(
                    nama_buah="Jeruk Sunkist",
                    sku="3022",
                    current_stock=2.8,
                    unit="kg",
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuD9mb0OYoRvZAtIKrX5H7-sAIecs7FTDG-_sbgl8L3mZgHuxnp3c5vNSEEozygWMpi9CQnh1YEzTOlLYym56nrsqAOxjxrRmVn-P9Vj-gRykjEWQYhDRzH_CIx4Xm6iT1RprCR66xf_NL6SKqAHCR2dWg1PNwZPMoHA3VO_A60qB47_AqN_JtWd3wEk9Xa97ee5AYw171u2aB51FSAhW80LWd4grbSf_xAiBiL_INH-OYEhNrc70q-z"
                ),
                Buah(
                    nama_buah="Anggur Merah",
                    sku="4055",
                    current_stock=12.5,
                    unit="kg",
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuDIj4W5Ao2H5GbcVdaffIFO7CvDIkRYQ_k09wc_AApZd9JmN7lywRSRZN_RNhaM_cf5bwz-p8EdGvO5Iw57VOl8eBLrux7FE9mg4F7Fl3HiY2vnM5wEOZ7k7WNbrc6L6kkSBk1xVlY33_qZo5faSqMFK94MBs66EDMlgX1UR6TvZAfG92HY3sXJ3IooYo_NQW7SGFkhrCvpDpX6tiGfPKwzM0Ye0sbXUErjGoGesGb79TvIb1YzFuU3"
                ),
                Buah(
                    nama_buah="Belimbing",
                    sku="4092",
                    current_stock=0.0,
                    unit="kg",
                    image="https://images.unsplash.com/photo-1610450949065-2f22ff37c76a?auto=format&fit=crop&w=300&q=80"
                ),
                Buah(
                    nama_buah="Buah Pir",
                    sku="5011",
                    current_stock=0.0,
                    unit="kg",
                    image="https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=300&q=80"
                ),
                Buah(
                    nama_buah="Lengkeng",
                    sku="5022",
                    current_stock=0.0,
                    unit="kg",
                    image="https://images.unsplash.com/photo-1544057940-19aa74a4413b?auto=format&fit=crop&w=300&q=80"
                ),
                Buah(
                    nama_buah="Mangga Harum Manis",
                    sku="5033",
                    current_stock=0.0,
                    unit="kg",
                    image="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80"
                ),
                Buah(
                    nama_buah="Buah Naga",
                    sku="5044",
                    current_stock=0.0,
                    unit="kg",
                    image="https://images.unsplash.com/photo-1527325679968-230cb667b5f5?auto=format&fit=crop&w=300&q=80"
                )
            ]
            db.add_all(fruits)
            db.flush()

        # 4. Seed Transaction logs & items (using 2026 mock dates)
        if db.query(Transaksi).count() == 0:
            print("Seeding default transaction logs...")
            # We seed transaction logs and detail items manually
            t1 = Transaksi(
                id_transaksi="TRX-FV-20260712-042",
                supplier_name="Sinar Jaya Orchards",
                time_str="12:45 WIB",
                date_group="Hari Ini",
                total_weight=450.5,
                status="Berhasil",
                type="incoming",
                created_at=datetime(2026, 7, 12, 12, 45)
            )
            db.add(t1)
            db.flush()
            db.add_all([
                TransaksiDetail(id_transaksi=t1.id_transaksi, nama_buah="Apel Fuji", sku="1042", jumlah=250, image="https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r"),
                TransaksiDetail(id_transaksi=t1.id_transaksi, nama_buah="Pisang Ambon", sku="2012", jumlah=200.5, image="https://lh3.googleusercontent.com/aida-public/AB6AXuAPcApLrxFvNPvGVQ-vMjePGebTERdjEp5Qip9BJPdnsPVd_tjDfY-i_uFeFSmp9W9puZ8kVldnxbbR3tqPuiJY69mqCFtOsnrfFIgdFUHuFb1tmcrRyYh_B-T_gAyDAGCFC6j1SJRQK9bjYtuTCj3jcXoyEgVXsQlGq25IrmhgIGDsy_8qgH7LNAakNPzbzZ-9vcnl-B7leFyaXICWTAajvfOEXrCg9NV8okDpuJnm4TNCUWsKV4TB")
            ])

            t2 = Transaksi(
                id_transaksi="TRX-FV-20260712-009",
                supplier_name="Koperasi Tani Makmur",
                time_str="09:15 WIB",
                date_group="Hari Ini",
                total_weight=1200.0,
                status="Diproses",
                type="outgoing",
                created_at=datetime(2026, 7, 12, 9, 15)
            )
            db.add(t2)
            db.flush()
            db.add_all([
                TransaksiDetail(id_transaksi=t2.id_transaksi, nama_buah="Jeruk Sunkist", sku="3022", jumlah=600, image="https://lh3.googleusercontent.com/aida-public/AB6AXuD9mb0OYoRvZAtIKrX5H7-sAIecs7FTDG-_sbgl8L3mZgHuxnp3c5vNSEEozygWMpi9CQnh1YEzTOlLYym56nrsqAOxjxrRmVn-P9Vj-gRykjEWQYhDRzH_CIx4Xm6iT1RprCR66xf_NL6SKqAHCR2dWg1PNwZPMoHA3VO_A60qB47_AqN_JtWd3wEk9Xa97ee5AYw171u2aB51FSAhW80LWd4grbSf_xAiBiL_INH-OYEhNrc70q-z"),
                TransaksiDetail(id_transaksi=t2.id_transaksi, nama_buah="Anggur Merah", sku="4055", jumlah=600, image="https://lh3.googleusercontent.com/aida-public/AB6AXuDIj4W5Ao2H5GbcVdaffIFO7CvDIkRYQ_k09wc_AApZd9JmN7lywRSRZN_RNhaM_cf5bwz-p8EdGvO5Iw57VOl8eBLrux7FE9mg4F7Fl3HiY2vnM5wEOZ7k7WNbrc6L6kkSBk1xVlY33_qZo5faSqMFK94MBs66EDMlgX1UR6TvZAfG92HY3sXJ3IooYo_NQW7SGFkhrCvpDpX6tiGfPKwzM0Ye0sbXUErjGoGesGb79TvIb1YzFuU3")
            ])

            t3 = Transaksi(
                id_transaksi="TRX-FV-20260711-094",
                supplier_name="Global Tropical Fruit",
                time_str="16:20 WIB",
                date_group="Kemarin",
                total_weight=85.2,
                status="Berhasil",
                type="incoming",
                created_at=datetime(2026, 7, 11, 16, 20)
            )
            db.add(t3)
            db.flush()
            db.add_all([
                TransaksiDetail(id_transaksi=t3.id_transaksi, nama_buah="Buah Pir", sku="5011", jumlah=40.2, image="https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=300&q=80"),
                TransaksiDetail(id_transaksi=t3.id_transaksi, nama_buah="Buah Naga", sku="5044", jumlah=45, image="https://images.unsplash.com/photo-1527325679968-230cb667b5f5?auto=format&fit=crop&w=300&q=80")
            ])

            t4 = Transaksi(
                id_transaksi="TRX-FV-20260711-011",
                supplier_name="Petani Mangga Arumanis",
                time_str="14:00 WIB",
                date_group="Kemarin",
                total_weight=312.0,
                status="Berhasil",
                type="incoming",
                created_at=datetime(2026, 7, 11, 14, 0)
            )
            db.add(t4)
            db.flush()
            db.add_all([
                TransaksiDetail(id_transaksi=t4.id_transaksi, nama_buah="Belimbing", sku="4092", jumlah=112, image="https://lh3.googleusercontent.com/aida-public/AB6AXuAmO09yNJ8F4-wzk9k4suHeRnevCzcriTHcSC2UEaS6FcP-bbKDThwNrdc22lF4NG41lGl9YyN_gJI9E1Y9bNBRpp8smf_gKTGLdbimF3VBV3XMvBVPQlHowWNOcRfBO90Evmtcwxgoqsj72DVdku8pfWUdRGTzhoajk_QMh9-f7_nfttxIp1D-Lb0hI_L9poTvuOV-cY3SqHA_BKS3fXF547Ynzky5__F07miG1HfuIWoAiOjwr753"),
                TransaksiDetail(id_transaksi=t4.id_transaksi, nama_buah="Apel Fuji", sku="1042", jumlah=200, image="https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r")
            ])

            t5 = Transaksi(
                id_transaksi="TRX-FV-20260620-112",
                supplier_name="Kebun Segar Abadi",
                time_str="10:30 WIB",
                date_group="20 Juni 2026",
                total_weight=150.0,
                status="Berhasil",
                type="incoming",
                created_at=datetime(2026, 6, 20, 10, 30)
            )
            db.add(t5)
            db.flush()
            db.add_all([
                TransaksiDetail(id_transaksi=t5.id_transaksi, nama_buah="Apel Fuji", sku="1042", jumlah=100, image="https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r"),
                TransaksiDetail(id_transaksi=t5.id_transaksi, nama_buah="Jeruk Sunkist", sku="3022", jumlah=50, image="https://lh3.googleusercontent.com/aida-public/AB6AXuD9mb0OYoRvZAtIKrX5H7-sAIecs7FTDG-_sbgl8L3mZgHuxnp3c5vNSEEozygWMpi9CQnh1YEzTOlLYym56nrsqAOxjxrRmVn-P9Vj-gRykjEWQYhDRzH_CIx4Xm6iT1RprCR66xf_NL6SKqAHCR2dWg1PNwZPMoHA3VO_A60qB47_AqN_JtWd3wEk9Xa97ee5AYw171u2aB51FSAhW80LWd4grbSf_xAiBiL_INH-OYEhNrc70q-z")
            ])
            
            db.commit()

        print("Database seeding completed.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
