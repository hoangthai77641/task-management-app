# 🌐 Hướng dẫn Deploy Production với Domain Thực

## 🎯 **TỔNG QUAN DEPLOYMENT**

### **Kiến trúc Production:**
- **Frontend**: Netlify + Custom Domain
- **Backend**: Railway/Render + Database
- **Domain**: Custom domain với SSL
- **Database**: PostgreSQL (Railway/Render)

---

## 📋 **BƯỚC 1: MUA DOMAIN VÀ CHUẨN BỊ**

### **1.1 Mua Domain (Khuyến nghị)**
```
Nhà cung cấp: Namecheap, GoDaddy, Cloudflare
Giá: $10-15/năm
Ví dụ domain hay:
- procrastination-coach.com
- goalmaster.app  
- lifegoals.dev
- habitforge.io
- focusflow.app
```

### **1.2 Chuẩn bị Repository**
```bash
# Push code lên GitHub
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

---

## 🖥️ **BƯỚC 2: DEPLOY BACKEND TRƯỚC**

### **2.1 Deploy Backend lên Railway**

#### **Bước 2.1.1: Tạo tài khoản Railway**
1. Truy cập [railway.app](https://railway.app)
2. Đăng nhập bằng GitHub
3. Click "New Project" → "Deploy from GitHub repo"

#### **Bước 2.1.2: Cấu hình Project**
```
- Repository: chọn task-management-app
- Root Directory: backend
- Framework: Node.js
```

#### **Bước 2.1.3: Cấu hình Environment Variables**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-production-2024
REFRESH_TOKEN_SECRET=your-refresh-secret-production-2024
CORS_ORIGIN=https://your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/db
BCRYPT_ROUNDS=12
```

#### **Bước 2.1.4: Thêm Database**
1. Railway Dashboard → Add Database → PostgreSQL
2. Copy DATABASE_URL từ database
3. Paste vào Environment Variables

#### **Bước 2.1.5: Deploy**
```bash
# Railway sẽ tự động deploy
# URL sẽ là: https://your-app-name.up.railway.app
```

### **2.2 Alternative: Deploy lên Render**

#### **Bước 2.2.1: Tạo Web Service**
1. [render.com](https://render.com) → New Web Service
2. Connect GitHub repository
3. Settings:
   - Name: anti-procrastination-backend
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start

#### **Bước 2.2.2: Thêm Database**
1. Render Dashboard → New PostgreSQL
2. Copy Internal Database URL
3. Add to Environment Variables

---

## 📱 **BƯỚC 3: DEPLOY FRONTEND**

### **3.1 Cập nhật Environment Variables**

#### **Sửa file .env.production:**
```env
# Thay YOUR_BACKEND_URL bằng URL thực từ Railway/Render
VITE_API_URL=https://your-backend-name.up.railway.app
VITE_APP_NAME=Anti-Procrastination Coach
VITE_ENABLE_AI_COACH=true
VITE_ENABLE_NOTIFICATIONS=true
```

### **3.2 Deploy lên Netlify**

#### **Bước 3.2.1: Build và Deploy**
```bash
cd frontend
npm run build
```

#### **Bước 3.2.2: Deploy Manual (Nhanh nhất)**
1. Truy cập [netlify.com](https://netlify.com)
2. Drag & drop folder `dist/` vào Netlify
3. Site sẽ có URL: `https://random-name.netlify.app`

#### **Bước 3.2.3: Deploy từ Git (Auto-deploy)**
1. Netlify → New site from Git
2. Connect GitHub → Chọn repository
3. Build settings:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

---

## 🌐 **BƯỚC 4: CẤU HÌNH CUSTOM DOMAIN**

### **4.1 Cấu hình Domain cho Frontend (Netlify)**

#### **Bước 4.1.1: Add Custom Domain**
1. Netlify Site Settings → Domain management
2. Add custom domain → Nhập domain của bạn
3. Netlify sẽ cung cấp DNS records

#### **Bước 4.1.2: Cấu hình DNS**
```
Tại nhà cung cấp domain (Namecheap/GoDaddy):

Type: CNAME
Name: www
Value: your-site-name.netlify.app

Type: A
Name: @
Value: 75.2.60.5 (Netlify Load Balancer)
```

#### **Bước 4.1.3: Enable HTTPS**
- Netlify tự động cấp SSL certificate
- Force HTTPS redirect trong settings

### **4.2 Cấu hình Subdomain cho Backend (Optional)**

#### **Nếu muốn API có subdomain riêng:**
```
DNS Records:
Type: CNAME  
Name: api
Value: your-backend.up.railway.app

Kết quả: https://api.your-domain.com
```

---

## 🔗 **BƯỚC 5: KẾT NỐI FRONTEND-BACKEND**

### **5.1 Cập nhật CORS trong Backend**
```javascript
// backend/src/middleware/cors.js
const allowedOrigins = [
  'https://your-domain.com',
  'https://www.your-domain.com',
  'http://localhost:5173' // for development
];
```

### **5.2 Cập nhật API URL trong Frontend**
```env
# frontend/.env.production
VITE_API_URL=https://your-backend.up.railway.app
# hoặc nếu có subdomain:
VITE_API_URL=https://api.your-domain.com
```

### **5.3 Redeploy Frontend**
```bash
cd frontend
npm run build
# Upload lại dist/ folder lên Netlify
```

---

## ✅ **BƯỚC 6: TESTING VÀ VERIFICATION**

### **6.1 Test Checklist**
```
□ Domain truy cập được: https://your-domain.com
□ HTTPS hoạt động (có khóa xanh)
□ API calls từ frontend thành công
□ Database connection hoạt động
□ Authentication flow hoạt động
□ File upload (nếu có)
□ Real-time features (nếu có)
```

### **6.2 Performance Check**
```
□ Page load speed < 3 giây
□ API response time < 500ms
□ Mobile responsive
□ SEO meta tags
```

---

## 🚨 **TROUBLESHOOTING THƯỜNG GẶP**

### **Frontend Issues:**
```
❌ 404 on page refresh
✅ Fix: Thêm redirects trong netlify.toml

❌ API calls bị block
✅ Fix: Check CORS settings trong backend

❌ Environment variables không load
✅ Fix: Rebuild với .env.production đúng
```

### **Backend Issues:**
```
❌ Database connection failed
✅ Fix: Check DATABASE_URL format

❌ CORS errors
✅ Fix: Add frontend domain vào allowedOrigins

❌ 500 Internal Server Error
✅ Fix: Check logs trong Railway/Render dashboard
```

### **Domain Issues:**
```
❌ Domain không truy cập được
✅ Fix: Wait 24-48h cho DNS propagation

❌ SSL certificate lỗi
✅ Fix: Force renew trong Netlify settings

❌ www vs non-www redirect
✅ Fix: Setup proper redirects trong DNS
```

---

## 💡 **PRODUCTION TIPS**

### **Security:**
- Sử dụng strong JWT secrets
- Enable rate limiting
- Set proper CORS origins
- Use HTTPS everywhere

### **Performance:**
- Enable gzip compression
- Use CDN (Netlify có sẵn)
- Optimize images và assets
- Database indexing

### **Monitoring:**
- Setup error tracking (Sentry)
- Monitor uptime (UptimeRobot)
- Analytics (Google Analytics)
- Performance monitoring

---

## 🎉 **KẾT QUẢ CUỐI CÙNG**

Sau khi hoàn thành tất cả bước:

✅ **Frontend**: `https://your-domain.com`
✅ **Backend**: `https://your-backend.up.railway.app`
✅ **Database**: PostgreSQL trên Railway/Render
✅ **SSL**: Tự động từ Netlify
✅ **Auto-deploy**: Từ GitHub commits

**Ví dụ URLs thực tế:**
- Frontend: `https://procrastination-coach.com`
- Backend: `https://anti-procrastination-api.up.railway.app`
- Admin: `https://procrastination-coach.com/admin`
