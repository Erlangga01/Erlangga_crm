Analisa & Desain Sistem CRM PT. SmartDokumen ini berisi rancangan database, alur sistem, dan kamus data untuk aplikasi CRM PT. Smart.1. Alur Kerja (Business Flow)Sistem dirancang untuk mengubah proses manual menjadi digital dengan alur sebagai berikut:Lead Capture: Sales menginput data calon customer (Leads).Processing: Jika Lead berminat, Sales memproses Lead menjadi Project.Verification:Lead menghilang dari list Lead dan masuk ke list Project.Project berstatus 'Survey' atau 'Pending Approval'.Approval (Manager): Manager melakukan review project. Jika OK, klik Approve.Installation: Setelah diapprove, tim teknis (disimulasikan) melakukan instalasi.Closing: Project ditandai selesai dan data otomatis pindah ke Master Customer (Subscription).2. Entity Relationship Diagram (Schema Design)Kami menggunakan PostgreSQL v14. Berikut adalah rancangan tabelnya.A. UsersMenyimpan data karyawan (Sales & Manager).CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'sales', -- 'sales', 'manager', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
B. Products (Layanan)Menyimpan daftar paket internet.CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    bandwidth_mbps INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
C. Leads (Calon Customer)Database mentah calon pelanggan.CREATE TABLE leads (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id), -- Sales yang input
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    interested_product_id BIGINT REFERENCES products(id),
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
D. Projects (Proses Instalasi)Tabel transisi dari Lead menjadi Customer. Membutuhkan approval.CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES leads(id),
    product_id BIGINT REFERENCES products(id),
    sales_id BIGINT REFERENCES users(id),
    surveyor_name VARCHAR(255),
    installation_date DATE,
    status VARCHAR(50) DEFAULT 'Survey', -- 'Survey', 'Pending Approval', 'Installation', 'Completed', 'Cancelled'
    is_manager_approved BOOLEAN DEFAULT FALSE,
    approved_by BIGINT REFERENCES users(id), -- Manager ID
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
E. Customers (Subscription)Data pelanggan yang sudah aktif/billing berjalan.CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    user_account_number VARCHAR(20) UNIQUE NOT NULL, -- Generated ID (ex: CUST-2023-001)
    project_id BIGINT REFERENCES projects(id),
    name VARCHAR(255) NOT NULL,
    billing_address TEXT NOT NULL,
    subscription_start_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Suspended', 'Churned'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
3. Tech Stack RecommendationSesuai best practice untuk Fullstack Developer:Backend: Laravel 11 (PHP 8.2+)Database: PostgreSQL 14Frontend: Blade Templates dengan Tailwind CSS (atau React/Vue via Inertia.js)Version Control: Git4. Clue & Strategy (Readme Note)Untuk menjalankan aplikasi ini:Clone repository.cp .env.example .env dan sesuaikan DB Credentials.composer install & npm install.php artisan migrate --seed (Pastikan seeder user Manager & Sales sudah dibuat).Login menggunakan manager@smart.co.id untuk tes fitur approval.