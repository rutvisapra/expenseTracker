# Features Documentation

## Core Features

### 1. User Authentication
- **Registration**: Create new user account with name, email, and password
- **Login**: Secure login with JWT token generation
- **Password Security**: BCrypt hashing for password storage
- **Session Management**: JWT token stored in localStorage
- **Auto-logout**: Token expiration after 7 days
- **Protected Routes**: Auth guard prevents unauthorized access

### 2. Expense Management

#### Add Expense
- Title/Description field
- Amount input (decimal support)
- Category selection dropdown:
  - Food
  - Travel
  - Bills
  - Shopping
  - Entertainment
- Date picker
- Instant save to database

#### View Expenses
- Table view with all expenses
- Sorted by date (newest first)
- Shows: Title, Amount, Category, Date
- Category badges with color coding
- Responsive table design

#### Delete Expense
- One-click delete with confirmation
- Instant UI update
- Permanent removal from database

### 3. Dashboard Analytics

#### Summary Cards
- **Total Expenses**: Sum of all expenses for current month
- **Total Transactions**: Count of expense entries
- **Current Month**: Display current month/year

#### Interactive Charts

**Pie Chart - Category Distribution**
- Visual breakdown of spending by category
- Percentage representation
- Color-coded categories
- Hover tooltips with exact amounts

**Bar Chart - Daily Expenses**
- Daily spending visualization
- X-axis: Days of month
- Y-axis: Amount spent
- Hover tooltips with details

#### Recent Expenses Table
- Last 10 expenses displayed
- Quick overview of recent activity
- Delete functionality
- Responsive design

### 4. Navigation
- Clean navbar with app branding
- Quick access to Add Expense
- Logout button
- Responsive mobile menu

## Technical Features

### Backend (ASP.NET Core)

#### RESTful API
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Proper status codes
- Error handling

#### Database
- Entity Framework Core ORM
- Code-First approach
- Automatic migrations
- SQL Server support
- Relationship management

#### Security
- JWT Bearer authentication
- Password hashing with BCrypt
- CORS configuration
- HTTPS enforcement
- SQL injection prevention

#### LINQ Queries
- Efficient data filtering
- Aggregation functions
- Grouping operations
- Sorting and ordering

### Frontend (Angular)

#### Modern Angular
- Standalone components
- Signals for reactivity
- TypeScript strict mode
- Reactive forms

#### HTTP Communication
- HttpClient service
- Interceptors for auth
- Error handling
- Observable patterns

#### Routing
- Lazy loading ready
- Route guards
- Navigation guards
- Redirect handling

#### UI/UX
- Bootstrap 5 styling
- Responsive design
- Mobile-first approach
- Clean modern interface
- Loading states
- Error messages

## API Endpoints

### Authentication
```
POST /api/auth/register
Body: { name, email, password }
Response: { token }

POST /api/auth/login
Body: { email, password }
Response: { token }
```

### Expenses
```
GET /api/expenses
Headers: Authorization: Bearer {token}
Response: [{ id, title, amount, category, date }]

POST /api/expenses
Headers: Authorization: Bearer {token}
Body: { title, amount, category, date }
Response: { id, title, amount, category, date }

PUT /api/expenses/{id}
Headers: Authorization: Bearer {token}
Body: { title, amount, category, date }
Response: 204 No Content

DELETE /api/expenses/{id}
Headers: Authorization: Bearer {token}
Response: 204 No Content
```

### Analytics
```
GET /api/analytics/monthly?year={year}&month={month}
Headers: Authorization: Bearer {token}
Response: { dailyExpenses, totalExpenses, month, year }

GET /api/analytics/category?year={year}&month={month}
Headers: Authorization: Bearer {token}
Response: [{ category, total, count }]
```

## User Workflows

### New User Registration
1. Navigate to app
2. Click "Register"
3. Fill in name, email, password
4. Submit form
5. Auto-login with JWT token
6. Redirect to dashboard

### Adding an Expense
1. Click "Add Expense" button
2. Fill in expense details
3. Select category from dropdown
4. Choose date
5. Click "Add Expense"
6. Redirect to dashboard
7. See updated charts and table

### Viewing Analytics
1. Login to dashboard
2. View summary cards at top
3. Check pie chart for category breakdown
4. Review bar chart for daily trends
5. Scroll to see recent expenses table

### Managing Expenses
1. View expenses in table
2. Click "Delete" on any expense
3. Confirm deletion
4. See instant update in UI
5. Charts automatically refresh

## Future Enhancement Ideas

### Planned Features
- Edit expense functionality
- Date range filters
- Search and filter expenses
- Export to CSV/PDF
- Budget tracking and alerts
- Recurring expenses
- Multiple currency support
- Expense categories customization
- Monthly/yearly comparison charts
- Email notifications
- Dark mode
- Mobile app version

### Advanced Analytics
- Spending trends over time
- Budget vs actual comparison
- Category-wise monthly trends
- Predictive spending analysis
- Custom date range reports

### Social Features
- Shared expenses (family/roommates)
- Split bills
- Group expense tracking
- Expense sharing via link

### Integration
- Bank account sync
- Receipt scanning (OCR)
- Calendar integration
- Cloud backup
- Multi-device sync
