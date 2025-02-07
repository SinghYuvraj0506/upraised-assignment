
# 🚀 Gadget API  

Gadget API is a backend service for managing gadgets with features like self-destruction and unique naming. This project is built with **Node.js, Express, Prisma (PostgreSQL), and Zod for validation**.

## 🛠️ Features  
- Create gadgets with unique or user-defined names.  
- Self-destruct gadgets using a secure code.  
- User authentication with JWT.  
- Swagger documentation for API reference.  

---

## 🏗️ Installation  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/SinghYuvraj0506/upraised-assignment
cd upraised-assignment
```

### **2️⃣ Install Dependencies**  
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**  
Create a `.env` file by copying .env.sample:  

### **4️⃣ Set Up Database**  
Run migrations to apply Prisma schema:  
```sh
npx prisma migrate dev --name init
```

If you need to push schema updates later:  
```sh
npx prisma db push
```

---

## 🚀 Running the Server  

Start the server in development mode:  
```sh
npm run dev
```
For production:  
```sh
npm start
```

---

## 📜 API Documentation  

The API documentation is available via Swagger at:  
🔗 **[Live API Docs](https://upraised-assignment-rvgq.onrender.com/docs)**  

Or run locally and visit:  
```sh
http://localhost:5000/docs
```

---

## 📌 Technologies Used  
- **Node.js** - Server-side JavaScript runtime  
- **Express.js** - Web framework  
- **Prisma** - ORM for PostgreSQL  
- **JWT** - Authentication  
- **Swagger** - API documentation  
- **Zod** - Input validation  

---
