-- Reset Expense IDs to start from 1
-- Run this after deleting all expenses

USE ExpenseTrackerDb;
GO

-- Reset the identity counter
DBCC CHECKIDENT ('Expenses', RESEED, 0);
GO

-- Verify
SELECT IDENT_CURRENT('Expenses') AS CurrentIdentity;
GO
