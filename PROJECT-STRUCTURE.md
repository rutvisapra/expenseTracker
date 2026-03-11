# Project Structure

## Complete Folder Structure

```
ExpenseTracker/
│
├── ExpenseTracker.API/                    # Backend ASP.NET Core Web API
│   ├── Controllers/                       # API Controllers
│   │   ├── AuthController.cs             # Authentication endpoints
│   │   ├── ExpensesController.cs         # Expense CRUD operations
│   │   └── AnalyticsController.cs        # Analytics endpoints
│   │
│   ├── Models/                           # Database Models
│   │   ├── User.cs                       # User entity
│   │   └── Expense.cs                    # Expense entity
│   │
│   ├── DTOs/                             # Data Transfer Objects
│   │   ├── LoginDto.cs                   # Login request
│   │   ├── RegisterDto.cs                # Registration request
│   │   ├── ExpenseDto.cs                 # Expense response
│   │   └── CreateExpenseDto.cs           # Create/Update expense request
│   │
│   ├── Services/                         # Business Logic Layer
│   │   ├── IAuthService.cs               # Auth service interface
│   │   ├── AuthService.cs                # Authentication logic
│   │   ├── IExpenseService.cs            # Expense service interface
│   │   ├── ExpenseService.cs             # Expense business logic
│   │   ├── IAnalyticsService.cs          # Analytics service interface
│   │   └── AnalyticsService.cs           # Analytics calculations
│   │
│   ├── Data/                             # Data Access Layer
│   │   └── AppDbContext.cs               # Entity Framework DbContext
│   │
│   ├── Properties/
│   │   └── launchSettings.json           # Development settings
│   │
│   ├── appsettings.json                  # Configuration (connection strings, JWT)
│   ├── appsettings.Development.json      # Development configuration
│   ├── Program.cs                        # Application entry point
│   └── ExpenseTracker.API.csproj         # Project file
│
├── expense-tracker-ui/                    # Frontend Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/               # UI Components
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.css
│   │   │   │   ├── register/
│   │   │   │   │   ├── register.component.ts
│   │   │   │   │   ├── register.component.html
│   │   │   │   │   └── register.component.css
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── dashboard.component.ts
│   │   │   │   │   ├── dashboard.component.html
│   │   │   │   │   └── dashboard.component.css
│   │   │   │   └── add-expense/
│   │   │   │       ├── add-expense.component.ts
│   │   │   │       ├── add-expense.component.html
│   │   │   │       └── add-expense.component.css
│   │   │   │
│   │   │   ├── services/                 # API Services
│   │   │   │   ├── auth.service.ts       # Authentication API calls
│   │   │   │   ├── expense.service.ts    # Expense API calls
│   │   │   │   └── analytics.service.ts  # Analytics API calls
│   │   │   │
│   │   │   ├── models/                   # TypeScript Models
│   │   │   │   ├── auth.model.ts         # Auth interfaces
│   │   │   │   └── expense.model.ts      # Expense interfaces
│   │   │   │
│   │   │   ├── guards/                   # Route Guards
│   │   │   │   └── auth.guard.ts         # Authentication guard
│   │   │   │
│   │   │   ├── interceptors/             # HTTP Interceptors
│   │   │   │   └── auth.interceptor.ts   # JWT token interceptor
│   │   │   │
│   │   │   ├── app.ts                    # Root component
│   │   │   ├── app.html                  # Root template
│   │   │   ├── app.css                   # Root styles
│   │   │   ├── app.config.ts             # App configuration
│   │   │   └── app.routes.ts             # Route definitions
│   │   │
│   │   ├── index.html                    # Main HTML file
│   │   ├── main.ts                       # Application bootstrap
│   │   ├── styles.css                    # Global styles
│   │   └── main.server.ts                # Server-side rendering
│   │
│   ├── angular.json                      # Angular CLI configuration
│   ├── package.json                      # NPM dependencies
│   ├── tsconfig.json                     # TypeScript configuration
│   └── README.md                         # Angular project readme
│
├── README.md                             # Main project documentation
├── SETUP-GUIDE.md                        # Detailed setup instructions
├── PROJECT-STRUCTURE.md                  # This file
├── start-backend.bat                     # Windows script to start API
├── start-frontend.bat                    # Windows script to start UI
└── setup-database.bat                    # Windows script to setup DB
```

## Backend Architecture

### Controllers Layer
- Handle HTTP requests/responses
- Route mapping
- Input validation
- Call service layer

### Services Layer
- Business logic
- Data validation
- LINQ queries
- Transaction management

### Data Layer
- Entity Framework Core
- Database context
- Entity configurations
- Migrations

### Models
- Database entities
- Relationships
- Constraints

### DTOs
- API request/response objects
- Separate from database models
- Data transformation

## Frontend Architecture

### Components
- Standalone Angular components
- Template-driven forms
- Event handling
- Data binding

### Services
- HTTP client calls
- API communication
- State management
- Error handling

### Guards
- Route protection
- Authentication checks
- Navigation control

### Interceptors
- HTTP request/response modification
- JWT token injection
- Error handling

### Models
- TypeScript interfaces
- Type safety
- Data contracts

## Key Technologies

### Backend
- **ASP.NET Core 9**: Web API framework
- **Entity Framework Core 9**: ORM
- **SQL Server**: Database
- **JWT**: Authentication
- **BCrypt**: Password hashing
- **Swagger**: API documentation

### Frontend
- **Angular 21**: Frontend framework
- **TypeScript**: Programming language
- **Bootstrap 5**: CSS framework
- **Chart.js**: Charting library
- **ng2-charts**: Angular wrapper for Chart.js
- **RxJS**: Reactive programming

## Design Patterns Used

### Backend
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Loose coupling
- **Service Layer Pattern**: Business logic separation
- **DTO Pattern**: Data transfer
- **Middleware Pattern**: Request pipeline

### Frontend
- **Component Pattern**: UI composition
- **Service Pattern**: Business logic
- **Guard Pattern**: Route protection
- **Interceptor Pattern**: HTTP middleware
- **Observable Pattern**: Async data streams

## Database Design

### Users Table
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL
);
```

### Expenses Table
```sql
CREATE TABLE Expenses (
    Id INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(200) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Date DATETIME NOT NULL,
    UserId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

## API Flow

1. **Authentication Flow**
   - User submits credentials
   - AuthController receives request
   - AuthService validates credentials
   - JWT token generated
   - Token returned to client

2. **Expense CRUD Flow**
   - Client sends request with JWT
   - AuthInterceptor adds token
   - ExpensesController validates token
   - ExpenseService processes request
   - DbContext executes query
   - Response returned to client

3. **Analytics Flow**
   - Client requests analytics
   - AnalyticsController receives request
   - AnalyticsService runs LINQ queries
   - Aggregated data returned
   - Charts rendered on frontend

## Security Features

- Password hashing with BCrypt
- JWT token authentication
- HTTPS enforcement
- CORS configuration
- Route guards
- SQL injection prevention (EF Core)
- XSS protection (Angular sanitization)

## Performance Optimizations

- Async/await throughout
- LINQ query optimization
- Lazy loading disabled
- Index on User.Email
- HTTP interceptor for token
- Angular standalone components
- Chart.js lazy loading
