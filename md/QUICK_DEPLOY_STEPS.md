# ⚡ Các Bước Deploy Nhanh với Domain Thực

## 🎯 **THỨ TỰ DEPLOY (QUAN TRỌNG)**
```
1. Backend trước → Lấy API URL
2. Frontend sau → Sử dụng API URL  
3. Domain cuối → Point đến deployed apps
```

---

## 🚀 **BƯỚC 1: DEPLOY BACKEND (15 phút)**

### **Railway (Khuyến nghị - Miễn phí)**
```bash
1. Truy cập: https://railway.app
2. Login với GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Chọn repository → Root directory: "backend"
5. Add PostgreSQL database
6. Environment Variables:
   NODE_ENV=production
   JWT_SECRET=your-secret-key-2024
   CORS_ORIGIN=https://your-domain.com
7. Deploy → Lấy URL: https://xxx.up.railway.app
```

---

## 📱 **BƯỚC 2: DEPLOY FRONTEND (10 phút)**

### **Cập nhật API URL**
```bash
# Sửa file: frontend/.env.production
VITE_API_URL=https://xxx.up.railway.app
```

### **Netlify Deploy**
```bash
1. cd frontend && npm run build
2. Truy cập: https://netlify.com
3. Drag & drop folder "dist" 
4. Lấy URL: https://xxx.netlify.app
```

---

## 🌐 **BƯỚC 3: CUSTOM DOMAIN (30 phút)**

### **Mua Domain**
```
Namecheap/GoDaddy: $10-15/năm
Ví dụ: procrastination-coach.com
```

### **Cấu hình DNS**
```
Tại nhà cung cấp domain:
Type: A     | Name: @   | Value: 75.2.60.5
Type: CNAME | Name: www | Value: xxx.netlify.app
```

### **Add Domain vào Netlify**
```
1. Netlify Site → Domain settings
2. Add custom domain: your-domain.com
3. Enable HTTPS (tự động)
```

---

## 🔧 **BƯỚC 4: KẾT NỐI & TEST (5 phút)**

### **Update CORS Backend**
```javascript
// Thêm domain vào Railway Environment:
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

### **Test Production**
```
✅ https://your-domain.com loads
✅ Login/Register hoạt động  
✅ API calls thành công
✅ HTTPS có khóa xanh
```

---

## 💰 **CHI PHÍ TỔNG**
```
Domain: $10-15/năm
Railway: $0 (500h/tháng free)
Netlify: $0 (100GB bandwidth free)
Total: ~$12/năm
```

---

## 🎉 **KẾT QUẢ**
```
Frontend: https://your-domain.com
Backend:  https://xxx.up.railway.app  
Database: PostgreSQL on Railway
SSL:      Tự động từ Netlify
```

---

## 🚨 **NẾU GẶP LỖI**

### **CORS Error:**
```bash
# Railway → Environment Variables
CORS_ORIGIN=https://your-domain.com
```

### **404 on Refresh:**
```bash
# File netlify.toml đã có sẵn
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **API Not Working:**
```bash
# Check frontend/.env.production
VITE_API_URL=https://correct-backend-url.up.railway.app
```

---

## ⏰ **TIMELINE**
```
Tổng thời gian: ~1 tiếng
- Backend deploy: 15 phút
- Frontend deploy: 10 phút  
- Domain setup: 30 phút
- Testing: 5 phút
```
