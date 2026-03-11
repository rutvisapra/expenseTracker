# Useful Commands Reference

## Database Commands

### Create Migration
```bash
cd ExpenseTracker/ExpenseTracker.API
dotnet ef migrations add InitialCreate
```

### Apply Migration
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

## Backend Commands

### Build
```bash
cd ExpenseTracker/ExpenseTracker.API
dotnet build
```

### Run
```bash
dotnet run
```

### Watch (auto-reload)
```bash
dotnet watch run
```

### Publish
```bash
dotnet publish -c Release
```

## Frontend Commands

### Install Dependencies
```bash
cd ExpenseTracker/expense-tracker-ui
npm install
```

### Start Dev Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Package Management

### Add Backend Package
```bash
dotnet add package PackageName
```

### Add Frontend Package
```bash
npm install package-name
```

## Quick Commands

### Full Setup
```bash
# Backend
cd ExpenseTracker/ExpenseTracker.API
dotnet ef database update
dotnet run

# Frontend (new terminal)
cd ExpenseTracker/expense-tracker-ui
npm install
npm start
```
