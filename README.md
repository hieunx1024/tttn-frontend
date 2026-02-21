# JobHunter Frontend

Hệ thống Frontend cho JobHunter, được xây dựng bằng React (Vite) + TailwindCSS.

## 🚀 Cài đặt & Chạy

Yêu cầu: `node` >= 18.

1.  **Cài đặt dependencies:**
    ```bash
    cd jobhunter-frontend
    npm install
    # Nếu gặp lỗi tailwind init:
    npm install -D tailwindcss postcss autoprefixer
    ```

2.  **Cấu hình môi trường:**
    Mặc định API URL là `http://localhost:8080/api/v1`.
    Nếu cần đổi, tạo file `.env`:
    ```
    VITE_API_URL=http://localhost:8080/api/v1
    ```

3.  **Chạy Dev Server:**
    ```bash
    npm run dev
    ```
    Truy cập: `http://localhost:5173`

## 🛠 Công Nghệ Sử Dụng

*   **Core:** React 18, Vite
*   **Styling:** TailwindCSS, Lucide Icons
*   **State & API:** React Query (TanStack Query), Axios
*   **Form:** React Hook Form + Yup
*   **Routing:** React Router v6
*   **Auth:** JWT (LocalStorage + HttpOnly Cookie Refresh)

## 📂 Cấu Trúc Thư Mục

```
src/
├── api/            # Cấu hình Axios & Endpoints
├── components/     # UI Components (JobCard, Table, Pagination...)
├── context/        # AuthContext
├── layouts/        # MainLayout, AdminLayout
├── pages/          # Pages (Auth, Job, Company, Admin...)
├── routes/         # ProtectedRoute
└── utils/          # Helpers
```

## ✅ Tính Năng Đã Tích Hợp

1.  **Authentication:** Login, Register, Logout, Auto Refresh Token.
2.  **Job:**
    *   Danh sách Job trang chủ (Featured).
    *   Tìm kiếm & Filter Job.
    *   Xem chi tiết Job.
    *   Ứng tuyển (Upload CV).
3.  **Company:**
    *   Danh sách Company.
    *   Xem chi tiết Company + Jobs của Company đó.
4.  **Admin Dashboard (Role SUPER_ADMIN):**
    *   Thống kê (Dashboard).
    *   Quản lý User (CRUD).
    *   Quản lý Company (CRUD).
    *   Quản lý Job (Update/Delete).

## 📝 Chưa Tích Hợp / Mở Rộng Sau

*   Implement Resume Management cho HR/Admin.
*   Trang Profile User (History Applied Jobs).
*   Role Management (Permission Assign).
*   Upload Avatar Company/User (Hiện dùng placeholder/upload logic cơ bản).
