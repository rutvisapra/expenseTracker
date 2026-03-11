# Complete Setup Guide

## Step-by-Step Installation

### 1. Install Prerequisites

#### Windows
- Download and install [.NET 9 SDK](https://dotnet.microsoft.com/download)
- Download and install [Node.js](https://nodejs.org/) (LTS version)
- Install SQL Server:
  - [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Free)
  - Or use SQL Server LocalDB (comes with Visual Studio)

Verify installations:
```bash
dotnet --version
node --version
npm --version
```

### 2. Database Setup

#### Option A: Using SQL Server LocalDB (Recommended for Development)
The default connection string is already configured for LocalDB:
```
Server=localhost;Database=ExpenseTrackerDb;Trusted_Connection=True;TrustServerCertificate=True;
```

#### Option B: Using SQL Server Express
Update `appsettings.json` connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=ExpenseTrackerDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

#### Option C: Using SQL Server with Username/Password
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ExpenseTrackerDb;User Id=your_username;Password=your_password;TrustServerCertificate=True;"
}
```

### 3. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd ExpenseTracker/ExpenseTracker.API
```

#### Install EF Core Tools (if not already installed)
```bash
dotnet tool install --global dotnet-ef
```

#### Create Database Migration
```bash
dotnet ef migrations add InitialCreate
```

#### Apply Migration to Database
```bash
dotnet ef database update
```

#### Run the Backend API
```bash
dotnet run
```

You should see output like:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7000
```

Keep this terminal open. The API is now running!

### 4. Frontend Setup

Open a NEW terminal and navigate to the frontend directory:

```bash
cd ExpenseTracker/expense-tracker-ui
```

#### Install Dependencies
```bash
npm install
```

This will install:
- Angular framework
- Bootstrap 5
- Chart.js and ng2-charts
- All other dependencies

#### Start the Development Server
```bash
npm start
```

Or alternatively:
```bash
ng serve
```

The Angular app will compile and open at `http://localhost:4200`

### 5. Test the Application

1. Open your browser to `http://localhost:4200`
2. Click "Register" to create a new account
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
4. Click Register
5. You'll be redirected to the dashboard
6. Click "Add Expense" to create your first expense
7. View the dashboard with charts and analytics

## Troubleshooting

### Backend Issues

#### Port Already in Use
If port 7000 is in use, update `Properties/launchSettings.json`:
```json
"applicationUrl": "https://localhost:7001;http://localhost:5001"
```

Also update the API URL in Angular services to match.

#### Database Connection Failed
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Try using SQL Server Management Studio to connect with the same credentials

#### Migration Errors
```bash
# Remove existing migrations
dotnet ef migrations remove

# Create fresh migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### Frontend Issues

#### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Port 4200 Already in Use
```bash
ng serve --port 4300
```

Then update CORS in backend `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:4300")
```

#### CORS Errors
Make sure:
1. Backend is running on `https://localhost:7000`
2. Frontend CORS is configured in `Program.cs`
3. API URLs in Angular services match the backend URL

## Running in Production

### Backend
```bash
cd ExpenseTracker/ExpenseTracker.API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd ExpenseTracker/expense-tracker-ui
npm run build
```

The production files will be in `dist/expense-tracker-ui/browser/`

## Database Commands Reference

### Create Migration
```bash
dotnet ef migrations add MigrationName
```

### Update Database
```bash
dotnet ef database update
```

### Remove Last Migration
```bash
dotnet ef migrations remove
```

### Drop Database
```bash
dotnet ef database drop
```

### List Migrations
```bash
dotnet ef migrations list
```

## Default Test Credentials

After registration, you can use these for testing:
- Email: test@example.com
- Password: Test123!

## API Testing with Swagger

Once the backend is running, visit:
```
https://localhost:7000/swagger
```

This provides an interactive API documentation where you can test all endpoints.

## Project URLs

- Frontend: http://localhost:4200
- Backend API: https://localhost:7000
- Swagger UI: https://localhost:7000/swagger

## Support

For issues:
1. Check that both backend and frontend are running
2. Verify database connection
3. Check browser console for errors (F12)
4. Check backend terminal for API errors
