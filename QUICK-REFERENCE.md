# Quick Reference Guide

## 🚀 Start the App

**Terminal 1 - Backend:**
```bash
cd ExpenseTracker/ExpenseTracker.API
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd ExpenseTracker/expense-tracker-ui
npm install
npm start
```

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend | http://localhost:5058 |

## 📋 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Expenses
```
GET    /api/expenses
GET    /api/expenses/{id}
POST   /api/expenses
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}
```

### Analytics
```
GET /api/analytics/monthly?year={year}&month={month}
GET /api/analytics/category?year={year}&month={month}
```

## 🎯 User Flow

1. **Register** → Create account
2. **Login** → Get JWT token
3. **Dashboard** → View expenses & charts
4. **Add Expense** → Create new expense
5. **View Analytics** → See charts
6. **Logout** → Clear token

## 📊 Features

- ✅ User authentication (JWT)
- ✅ Add/Edit/Delete expenses
- ✅ 5 expense categories
- ✅ Monthly analytics
- ✅ Pie chart (category breakdown)
- ✅ Bar chart (daily expenses)
- ✅ Responsive design

## 🗄️ Database

- **Type:** SQLite
- **File:** ExpenseTracker.db
- **Tables:** Users, Expenses
- **Auto-created:** Yes

## 🔑 Test Credentials

After registration, use your credentials:
- Email: your-email@example.com
- Password: your-password

## 📁 Project Structure

```
ExpenseTracker/
├── ExpenseTracker.API/     (Backend)
└── expense-tracker-ui/     (Frontend)
```

## 🛠️ Tech Stack

**Backend:** ASP.NET Core 9, EF Core, SQLite, JWT
**Frontend:** Angular 21, Bootstrap 5, Chart.js

## ⚡ Common Commands

```bash
# Backend
dotnet run                    # Start backend
dotnet build                  # Build backend
dotnet clean                  # Clean build

# Frontend
npm install                   # Install dependencies
npm start                     # Start dev server
npm run build                 # Build for production
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in launchSettings.json |
| npm install fails | Delete node_modules and package-lock.json |
| Database error | Delete ExpenseTracker.db and restart |
| CORS error | Check backend CORS config |
| Auth error | Clear localStorage and login again |

## 📝 Notes

- Database auto-creates on first run
- JWT tokens expire after 1 hour
- Passwords are hashed with BCrypt
- All API calls require JWT token (except auth)
- Frontend uses hash routing (#/login)

## ✅ Verification

- [ ] Backend running on 5058
- [ ] Frontend running on 4200
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can add expense
- [ ] Charts display
- [ ] Can logout

---

**Everything is ready to use!** 🎉
