SmartCRM - Customer Relationship ManagementAplikasi CRM sederhana untuk PT. Smart, dirancang untuk mendigitalkan proses pencatatan Leads, Project Instalasi, dan Manajemen Pelanggan Internet Service Provider.(Catatan: Ganti dengan screenshot aplikasi asli Anda nanti)📋 Fitur UtamaSesuai kebutuhan operasional sales dan manager:Authentication: Login Multi-role (Sales & Manager).Lead Management: Input dan tracking calon customer.Project Approval: Workflow approval Manager sebelum instalasi berjalan.Master Data: Manajemen produk layanan internet.Customer Database: List pelanggan yang sudah aktif (Billing).🛠 Teknologi yang DigunakanBackend: Laravel 11 / Ruby on Rails (Sesuai pilihan Anda)Frontend: Blade / ERB dengan Tailwind CSSDatabase: PostgreSQL v14Server: Apache/Nginx (Localhost)🚀 Cara Menjalankan Aplikasi (Installation)Ikuti langkah berikut untuk menjalankan project di local machine Anda:1. Clone Repositorygit clone [https://github.com/namaanda/namadepan_crm.git](https://github.com/namaanda/namadepan_crm.git)
cd namadepan_crm
2. Setup EnvironmentCopy file environment dan sesuaikan konfigurasi database (PostgreSQL):cp .env.example .env
Edit .env dan sesuaikan:DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=smart_crm
DB_USERNAME=postgres
DB_PASSWORD=password_anda
3. Install Dependenciescomposer install
npm install && npm run build
4. Database Migration & SeedingPenting: Jalankan perintah ini untuk membuat struktur tabel dan mengisi data akun Manager/Sales bawaan.php artisan migrate --seed
5. Jalankan Serverphp artisan serve
Akses aplikasi di http://localhost:8000.🔐 Akun Demo (Seeder)Gunakan akun berikut untuk pengujian fitur:RoleEmailPasswordManager (Approver)manager@smart.co.idpasswordSales (Inputer)sales@smart.co.idpassword📚 Analisa Sistem & Desain DatabaseLampiran untuk System AnalystAlur Bisnis (Business Flow)Sales input data Leads (Calon Customer).Sales memproses Lead yang berminat menjadi Project.Manager menerima notifikasi project baru (Status: Pending Approval).Manager melakukan Approval.Tim teknis melakukan instalasi -> Status Project berubah menjadi Completed.Sistem otomatis membuat data Customer baru.Skema Database (ERD)Aplikasi ini menggunakan relasi antar tabel sebagai berikut:users (Sales/Manager) One-to-Many leadsleads One-to-One projects (Saat dikonversi)projects One-to-One customers (Saat instalasi selesai)(Untuk detail query SQL lengkap dan Data Dictionary, silakan lihat file docs/system_design.md)👤 AuthorNama AndaFullstack Developer Applicant[Link LinkedIn Anda]