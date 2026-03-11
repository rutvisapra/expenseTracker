# Personal Expense Tracker

A full-stack web application for tracking personal expenses with analytics and charts.

## Tech Stack

### Backend
- ASP.NET Core Web API (.NET 9)
- Entity Framework Core
- SQLite Database
- JWT Authentication
- BCrypt for password hashing

### Frontend
- Angular 21
- Bootstrap 5
- Chart.js (ng2-charts)
- TypeScript

## Features

- User authentication (Register/Login with JWT)
- Add, edit, and delete expenses
- Category-based expense tracking (Food, Travel, Bills, Shopping, Entertainment)
- Dashboard with analytics
- Interactive charts:
  - Pie chart for category-wise expenses
  - Bar chart for daily expenses
  - Monthly spending summary
- Responsive design

## Project Structure

```
ExpenseTracker/
├── ExpenseTracker.API/          # Backend API
│   ├── Controllers/             # API Controllers
│   ├── Models/                  # Database Models
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Services/                # Business Logic
│   ├── Data/                    # DbContext
│   └── Program.cs               # App Configuration
└── expense-tracker-ui/          # Frontend Angular App
    └── src/
        └── app/
            ├── components/      # UI Components
            ├── services/        # API Services
            ├── models/          # TypeScript Models
            ├── guards/          # Route Guards
            └── interceptors/    # HTTP Interceptors
```

## Setup Instructions

### Prerequisites
- .NET 9 SDK
- Node.js (v18 or higher)

### Backend Setup

1. Navigate to the API directory:
```bash
cd ExpenseTracker/ExpenseTracker.API
```

2. Run the API:
```bash
dotnet run
```

The API will start at `http://localhost:5058`

### Frontend Setup

1. Navigate to the UI directory:
```bash
cd ExpenseTracker/expense-tracker-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Analytics
- `GET /api/analytics/monthly?year={year}&month={month}` - Get monthly analytics
- `GET /api/analytics/category?year={year}&month={month}` - Get category-wise analytics

## Database Schema

### Users Table
- Id (int, PK)
- Name (string)
- Email (string, unique)
- PasswordHash (string)

### Expenses Table
- Id (int, PK)
- Title (string)
- Amount (decimal)
- Category (string)
- Date (datetime)
- UserId (int, FK)

**Database:** SQLite (ExpenseTracker.db) - automatically created on first run

## Usage

1. Register a new account or login
2. Add expenses with title, amount, category, and date
3. View dashboard with:
   - Total expenses summary
   - Category-wise pie chart
   - Daily expenses bar chart
   - Recent expenses table
4. Delete expenses as needed

## Development Notes

- Backend uses JWT tokens for authentication
- Frontend stores JWT in localStorage
- HTTP interceptor automatically adds auth token to requests
- Route guards protect authenticated routes
- CORS is configured to allow Angular frontend

## Future Enhancements

- Export expenses to CSV/PDF
- Date range filters
- Budget tracking
- Recurring expenses
- Multi-currency support
- Email notifications

## Quick Start

```bash
# Terminal 1 - Backend
cd ExpenseTracker/ExpenseTracker.API
dotnet run

# Terminal 2 - Frontend
cd ExpenseTracker/expense-tracker-ui
npm install
npm start
```

Then open http://localhost:4200 in your browser.
