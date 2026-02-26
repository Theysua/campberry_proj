# Campberry Deployment Guide
# Campberry 部署与打包指南

This guide walks you through the steps required to deploy the Campberry platform to a production environment. The platform consists of a Vite/React frontend and a Node.js/Express backend with a PostgreSQL database.

---

## 1. Environment Preparation (环境准备)

Ensure your production server has the following installed:
- **Node.js**: v18.x or later.
- **PostgreSQL**: v13 or later.
- **Process Manager**: PM2 (recommended for Node.js backend).
- **Web Server**: Nginx (recommended for serving the frontend and proxying the backend).

### Database Setup (数据库设置)
1. Create a production PostgreSQL database.
2. Obtain the connection URL (e.g., `postgresql://user:password@localhost:5432/campberry_prod`).

---

## 2. Backend Deployment (后端部署)

The backend needs to be compiled from TypeScript to JavaScript before running.

### Step 2.1: Build the Backend
1. Navigate to the backend directory:
   ```bash
   cd campberry_backend
   ```
2. Install production dependencies:
   ```bash
   npm install --omit=dev
   ```
   *(Note: You might need devDependencies to build. If so, run `npm install` first).*
3. Add a build script to your `campberry_backend/package.json` if not present:
   ```json
   "scripts": {
     "build": "tsc",
     "start": "node dist/index.js",
     "postinstall": "prisma generate"
   }
   ```
4. Compile the TypeScript code:
   ```bash
   npx tsc
   ```

### Step 2.2: Configure Environment Variables
Create a `.env` file in the `campberry_backend` directory suitable for production:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/campberry_prod"
JWT_SECRET="your_secure_random_string_here"
PORT=3000
```

### Step 2.3: Database Migration & Seeding
Apply the schema structure and optionally seed the database:
```bash
npx prisma migrate deploy
npx ts-node scripts/seed.ts        # Optional: Load initial program data
npx ts-node scripts/createAccounts.ts # Optional: Create default admin accounts
```

### Step 2.4: Start Backend Service with PM2
```bash
npm install -g pm2
pm2 start dist/index.js --name "campberry-api"
pm2 save
pm2 startup
```

---

## 3. Frontend Deployment (前端部署)

The frontend needs to be built into static HTML/CSS/JS files, which will then be served by Nginx.

### Step 3.1: Build the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd campberry_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure API requests point to your production domain. Update API endpoints (e.g., in `src/services/api.js`) to point to your backend domain (e.g., `https://api.campberry.com/api/v1`) rather than `localhost:3000`. This usually involves `.env` variables in Vite like `VITE_API_URL`.
4. Run the production build:
   ```bash
   npm run build
   ```
   *This outputs the static files into the `dist/` directory.*

---

## 4. Nginx Configuration (Nginx 反向代理配置)

Set up Nginx to serve the static frontend files and proxy API requests to the backend PM2 instance.

Create an Nginx server block (e.g., `/etc/nginx/sites-available/campberry`):

```nginx
server {
    listen 80;
    server_name campberry.com www.campberry.com;

    # Serve the React Frontend
    root /path/to/extra_porj/campberry_frontend/dist;
    index index.html;

    # Handle React Router (SPA fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js Backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/campberry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. SSL / HTTPS (安全证书)
To secure the application with HTTPS, it is strongly recommended to use Certbot (Let's Encrypt).
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d campberry.com -d www.campberry.com
```

## Maintenance (维护命令)
- **Check Backend Logs**: `pm2 logs campberry-api`
- **Restart Backend**: `pm2 restart campberry-api`
- **Update Database Schema**: `npx prisma migrate deploy` followed by restarting PM2.
