# Personal Book Library

ระบบจัดการคลังหนังสือส่วนตัว — Web Application สำหรับเข้าสู่ระบบ ดูรายการหนังสือ เพิ่มหนังสือ ค้นหา/กรองหนังสือ และลบหนังสือ

## Tech Stack

**Backend**
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- SQL Server / SQL Server LocalDB
- JWT Authentication
- BCrypt (password hashing)

**Frontend**
- React (Vite)
- Axios (พร้อม Request/Response Interceptor)
- React Router
- Tailwind CSS
- Lucide React

**Database**
- Microsoft SQL Server (LocalDB)


## 1. Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server LocalDB (มาพร้อม Visual Studio หรือ SQL Server Express)
- Git

---

## 2. Backend Setup

### 2.1 ติดตั้ง Dependencies

```bash
cd PersonalBookLibrary
dotnet restore
```

### 2.2 ตั้งค่า Environment Variables / Connection String

แก้ไขไฟล์ `appsettings.json` (หรือ `appsettings.Development.json`):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=PersonalBookLibrary;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "SecretKey": "<ใส่ Secret Key ของคุณเอง>"
}
}
```

> **หมายเหตุ:** ห้าม commit ค่า JWT `Key` จริงลง Git — สำหรับการรันทดสอบในเครื่อง กรรมการสามารถใส่ค่าใดก็ได้ (string สุ่มยาวพอ) ในไฟล์ `appsettings.Development.json` ของตนเอง หรือใช้ `dotnet user-secrets` แทน

### 2.3 รัน Migration

เปิด Package Manager Console ใน Visual Studio แล้วรัน

```powershell
Update-Database

คำสั่งนี้จะสร้างฐานข้อมูล `PersonalBookLibrary` บน `(localdb)\MSSQLLocalDB` ตาม migration `InitialCreate`

### 2.4 รัน Backend

เปิดโปรเจกต์ Backend ด้วย Visual Studio และกด `Run` หรือ `F5`

Backend จะรันที่ (ตรวจสอบพอร์ตจริงใน `launchSettings.json`):

```
https://localhost:7021
```

---

## 3. Frontend Setup

### 3.1 ติดตั้ง Dependencies

```bash
cd client
npm install
```

### 3.2 ตั้งค่า API Base URL

ไฟล์ `client/src/api/api.js` กำหนด Base URL ไว้ที่:

```
https://localhost:7021/api
```

หากรัน Backend คนละพอร์ต ให้แก้ค่านี้ให้ตรงกัน

### 3.3 รัน Frontend

```bash
npm run dev
```

เปิดเบราว์เซอร์ตาม URL ที่ Vite แจ้ง (ปกติ `http://localhost:5173`)

---

## 4. Test Account (สำหรับ Login)

```
Username: admin
Password: 1234
```

---

## 5. API Endpoints โดยสรุป

| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/auth/login` | - | เข้าสู่ระบบ รับ JWT |
| GET | `/api/books` | - | ดูรายการหนังสือ (filter ด้วย `categoryId`, `authorId`) |
| GET | `/api/books/{id}` | - | ดูหนังสือรายเล่ม |
| POST | `/api/books` | Bearer Token | เพิ่มหนังสือ |
| DELETE | `/api/books/{id}` | Bearer Token | ลบหนังสือ |
| GET | `/api/authors` | - | รายชื่อผู้แต่ง |
| GET | `/api/categories` | - | รายชื่อหมวดหมู่ |

---

## 6. Postman Collection

ไฟล์ Collection สำหรับทดสอบ API ทั้งหมดอยู่ที่:

```
Personal Book Library API.postman_collection.json
```

Import เข้า Postman แล้วรันทดสอบได้ทันที (ครอบคลุม Login, CRUD, Filter, และกรณี Error ต่าง ๆ)

---