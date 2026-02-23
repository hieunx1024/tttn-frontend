<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Ant%20Design-6-0170FE?style=for-the-badge&logo=antdesign&logoColor=white" />
</p>

# 💼 JobHunter – Frontend

Giao diện người dùng cho hệ thống **JobHunter** – Nền tảng tuyển dụng trực tuyến. Được xây dựng bằng **React 19**, **Vite**, **Tailwind CSS 4** và **Ant Design 6**, hỗ trợ đa vai trò (Admin, HR, Candidate) với giao diện hiện đại và responsive.

---

## 📋 Mục lục

- [Demo & Screenshots](#-demo--screenshots)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [Tài khoản test](#-tài-khoản-test)

---

## 🖼 Demo & Screenshots

| Trang | Mô tả |
|---|---|
| **Trang chủ** | Hiển thị featured jobs, search với filter theo skills & location |
| **Danh sách Jobs** | Phân trang, tìm kiếm, lọc nâng cao |
| **Chi tiết Job** | Thông tin chi tiết + nút Ứng tuyển (Upload CV) |
| **Admin Dashboard** | Thống kê tổng quan + Biểu đồ (Recharts) |
| **HR Portal** | Quản lý tin tuyển dụng, hồ sơ ứng viên, gói dịch vụ |
| **Candidate Dashboard** | Theo dõi ứng tuyển, thống kê cá nhân |

---

## ✨ Tính năng

### 🌐 Trang công khai (Public)
- **Trang chủ**: Featured jobs, tìm kiếm theo tên + kỹ năng + địa điểm
- **Danh sách việc làm**: Phân trang, lọc nâng cao
- **Chi tiết việc làm**: Thông tin đầy đủ, ứng tuyển trực tiếp (upload CV)
- **Danh sách công ty**: Xem thông tin & các vị trí tuyển dụng

### 🔐 Authentication
- Đăng ký, Đăng nhập bằng Email/Password
- **Đăng nhập bằng Google** (OAuth2)
- Tự động refresh token khi hết hạn
- Chọn vai trò (HR/Candidate) khi đăng ký qua Social Login
- Bảo vệ routes theo vai trò (ProtectedRoute)

### 👨‍💼 HR Portal (`/hr`)
- **Dashboard**: Tổng quan thông tin HR
- **Quản lý tin tuyển dụng**: Tạo/Sửa/Xóa tin, hiển thị số tin đã đăng & còn lại
- **Quản lý ứng viên**: Xem hồ sơ, duyệt/từ chối, xem CV trực tiếp
- **Thông tin công ty**: Đăng ký & quản lý công ty
- **Gói dịch vụ**: Xem bảng giá, thanh toán VNPAY, nâng cấp gói

### 👤 Candidate Portal (`/candidate`)
- **Dashboard**: Thống kê số đơn ứng tuyển (pending, approved, rejected)
- **Ứng tuyển của tôi**: Danh sách các đơn đã nộp, theo dõi trạng thái
- **Hồ sơ cá nhân**: Cập nhật thông tin

### 🛡 Admin Panel (`/admin`)
- **Dashboard**: Thống kê tổng quan + **Biểu đồ cột** (Recharts)
  - Tổng Users, Companies, Jobs, Resumes, Subscribed Users, Doanh thu
- **Quản lý Users**: CRUD, phân quyền
- **Quản lý Companies**: Xem & quản lý công ty
- **Duyệt công ty**: Phê duyệt/Từ chối yêu cầu đăng ký công ty từ HR
- **Quản lý Jobs**: Xem & quản lý tất cả tin tuyển dụng
- **Quản lý Resumes**: Xem tất cả hồ sơ ứng tuyển trong hệ thống

---

## 🛠 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **React** | 19.2 | UI Library |
| **Vite** | 7.3 | Build tool & Dev server |
| **Tailwind CSS** | 4.1 | Utility-first CSS framework |
| **Ant Design** | 6.3 | UI Component library (Table, Modal, Form...) |
| **Lucide React** | 0.569 | Icon library |
| **React Router** | 7.13 | Client-side routing |
| **TanStack React Query** | 5.90 | Server state management & caching |
| **Axios** | 1.13 | HTTP Client |
| **React Hook Form** | 7.71 | Form management |
| **Yup** | 1.7 | Form validation schema |
| **Recharts** | 3.7 | Data visualization (Charts) |
| **React Toastify** | 11.0 | Toast notifications |
| **date-fns / dayjs** | – | Date formatting |
| **React Quill** | 2.0 | Rich text editor |

---

## 📂 Cấu trúc dự án

```
jobhunter-frontend/
├── public/                     # Static assets
├── src/
│   ├── api/                    # API Configuration
│   │   ├── axiosClient.js      # Axios instance (interceptors, auto refresh token)
│   │   └── endpoints.js        # Tập trung tất cả API endpoints
│   │
│   ├── components/             # Shared UI Components
│   │   ├── AdminTable.jsx      # Reusable data table (pagination, actions)
│   │   ├── JobCard.jsx         # Card hiển thị thông tin job
│   │   ├── StatCard.jsx        # Card thống kê (Dashboard)
│   │   └── ...
│   │
│   ├── context/                # React Context
│   │   └── AuthContext.jsx     # Authentication state (user, token, login/logout)
│   │
│   ├── layouts/                # Page Layouts
│   │   ├── MainLayout.jsx      # Layout trang chủ (Header + Footer)
│   │   ├── AdminLayout.jsx     # Layout Admin (Sidebar + Content)
│   │   ├── RecruiterLayout.jsx # Layout HR Portal
│   │   └── CandidateLayout.jsx # Layout Candidate
│   │
│   ├── pages/                  # Application Pages
│   │   ├── HomePage.jsx        # Trang chủ
│   │   ├── auth/               # Login, Register, SelectRole
│   │   ├── job/                # JobListPage, JobDetailPage
│   │   ├── company/            # CompanyListPage, CompanyDetailPage
│   │   ├── admin/              # AdminDashboard, UserManagement, ...
│   │   ├── hr/                 # HRDashboard, HRJobManagement, ...
│   │   ├── candidate/          # CandidateDashboard, MyApplications, ...
│   │   └── profile/            # ProfilePage
│   │
│   ├── routes/                 # Route Guards
│   │   └── ProtectedRoute.jsx  # Kiểm tra auth + role trước khi truy cập
│   │
│   ├── App.jsx                 # Root component (Routes configuration)
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind imports
│
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies & scripts
```

---

## ⚙ Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Node.js** >= 18 (`node -v`)
- **npm** >= 9 (`npm -v`)
- Backend API đang chạy tại `http://localhost:8080`

### 1. Clone dự án

```bash
git clone https://github.com/hieunx1024/jobhunter-frontend.git
cd jobhunter-frontend
```

### 2. Cài đặt dependencies

```bash
npm install
```

> ⚠️ Nếu gặp lỗi dependency conflict, sử dụng:
> ```bash
> npm install --legacy-peer-deps
> ```

### 3. Chạy Dev Server

```bash
npm run dev
```

Truy cập: **http://localhost:5173**

### 4. Build Production

```bash
npm run build
npm run preview   # Preview bản build
```

---

## 🔧 Cấu hình môi trường

Tạo file `.env` tại thư mục gốc:

```env
# API Backend URL
VITE_API_URL=http://localhost:8080/api/v1

# Google OAuth2 Client ID (tuỳ chọn)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> **Mặc định**: Nếu không có file `.env`, API URL sẽ là `http://localhost:8080/api/v1`

---

## 📖 Hướng dẫn sử dụng

### Luồng hoạt động chính

```
┌──────────────┐     Đăng ký      ┌──────────────┐
│   Candidate  │ ──────────────── │   Hệ thống   │
│   (Ứng viên) │                  │   JobHunter   │
└──────┬───────┘                  └──────┬───────┘
       │                                 │
       │  Tìm việc, Ứng tuyển (CV)      │
       │ ────────────────────────────►   │
       │                                 │
       │  Theo dõi trạng thái            │
       │ ◄────────────────────────────   │
       │                                 │

┌──────────────┐   Đăng ký Cty    ┌──────────────┐
│      HR      │ ──────────────── │    Admin      │
│ (Nhà tuyển)  │     Duyệt       │  (Quản trị)  │
└──────┬───────┘                  └──────┬───────┘
       │                                 │
       │  Đăng tin, Quản lý CV           │  Duyệt cty, Quản lý
       │  Mua gói (VNPAY)               │  Thống kê, Dashboard
       │                                 │
```

### Vai trò & Chức năng

| Vai trò | Chức năng chính | Route |
|---|---|---|
| **Khách** | Xem jobs, companies, tìm kiếm | `/`, `/jobs`, `/companies` |
| **Candidate** | Ứng tuyển, theo dõi đơn, hồ sơ | `/candidate/*` |
| **HR** | Đăng tin, quản lý CV, mua gói | `/hr/*` |
| **Admin** | Quản lý toàn hệ thống, thống kê | `/admin/*` |

---

## 🧪 Tài khoản test

| Vai trò | Email | Mật khẩu |
|---|---|---|
| **Super Admin** | `admin@gmail.com` | `123456` |
| **HR** | `hr@gmail.com` | `123456` |
| **Candidate** | `candidate@gmail.com` | `123456` |

> ⚠️ Các tài khoản trên chỉ dùng cho môi trường development/testing.

---

## 🔗 Liên kết

- **Backend Repository**: [github.com/hieunx1024/tttn](https://github.com/hieunx1024/tttn)
- **API Documentation**: `http://localhost:8080/swagger-ui/index.html` (khi chạy backend)

---

## 👨‍💻 Tác giả

- **Nguyễn Xuân Hiếu**
- Đồ án tốt nghiệp – Hệ thống tuyển dụng trực tuyến (JobHunter)

---

## 📄 License

Dự án được phát triển phục vụ mục đích học tập và đồ án tốt nghiệp.
