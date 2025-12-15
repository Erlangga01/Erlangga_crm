# Erlangga CRM - PT. Smart

Simple Customer Relationship Management (CRM) system for PT. Smart (ISP Company).
Built with Laravel 12 and Tailwind CSS.

## Features
- **User Authentication**: Login/Register (Roles: Sales, Manager).
- **Product Management**: CRUD for Internet Services/Products.
- **Lead Management**: Track potential customers (Leads).
- **Sales Process (Projects)**:
  - Create Projects (Link Lead + Product).
  - **Manager Approval Workflow**: Approve/Reject projects.
  - **Completion**: Mark project as installed -> Automatically converts Lead to Customer.
- **Customer Management**: List of subscribed customers with their active services.

## Requirements
- PHP 8.2+
- Composer
- PostgreSQL v14+ (Recommended) or MySQL/SQLite
- Node.js & NPM

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/erlangga_crm.git
    cd erlangga_crm
    ```

2.  **Install Dependencies**
    ```bash
    composer install
    npm install
    ```

3.  **Environment Setup**
    Copy `.env.example` to `.env` and configure your database credentials.
    ```bash
    cp .env.example .env
    ```
    Update DB settings in `.env`:
    ```ini
    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=erlangga_crm
    DB_USERNAME=postgres
    DB_PASSWORD=yourpassword
    ```

4.  **Generate Key & Migrate**
    ```bash
    php artisan key:generate
    php artisan migrate
    ```

5.  **Build Assets**
    ```bash
    npm run build
    ```

6.  **Run Server**
    ```bash
    php artisan serve
    ```
    Visit `http://localhost:8000`.

## Deployment (Heroku/Render)

1.  Ensure you have a `Procfile` (for Heroku) or configure build command:
    - Build Command: `composer install --no-dev --optimize-autoloader && npm install && npm run build && php artisan migrate --force`
    - Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT` (or use Apache/Nginx setup).

## Database Schema (SQL)
Migration files are located in `database/migrations`.
To dump the schema:
```bash
php artisan schema:dump
```

## User Roles
*Note: Currently, role management is simple string-based.*
- **Sales**: Can create Leads, Projects.
- **Manager**: Can Approve/Reject Projects.

To assign a manager role, you can manually update the database:
```sql
UPDATE users SET role = 'manager' WHERE email = 'manager@example.com';
```

## Tools Used
- Vscode / Cursor
- Laravel 12
- TailwindCss
- PostgreSQL
