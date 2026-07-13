from app.core.database import engine  # Sesuaikan dengan folder database.py kamu

def test_connection():
    try:
        # Mencoba melakukan koneksi dan eksekusi query ringan
        with engine.connect() as connection:
            print("=========================================")
            print("✅ KONEKSI SUKSES! FastAPI berhasil terhubung ke Supabase.")
            print("=========================================")
    except Exception as e:
        print("=========================================")
        print("❌ KONEKSI GAGAL! Periksa kembali password atau URL Supabase kamu.")
        print(f"Error detail: {e}")
        print("=========================================")

if __name__ == "__main__":
    test_connection()