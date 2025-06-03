# Mock Login Credentials

## Test Users

You can use any of these credentials to login:

### 1. Veterinarian Account
- **Email**: `sarah.johnson@ovovax.com`
- **Password**: `password123`
- **Role**: Veterinarian

### 2. Administrator Account
- **Email**: `ahmed@ovovax.com`
- **Password**: `admin123`
- **Role**: Administrator

### 3. Demo Account
- **Email**: `demo@ovovax.com`
- **Password**: `demo123`
- **Role**: Operator

## Registration

You can also register new accounts through the registration form. All new accounts will be automatically assigned the "operator" role.

## Notes

- This is a mock authentication system for development purposes
- All data is stored in memory and will be lost when you refresh the page
- No real backend server is required
- Network delays are simulated to mimic real API behavior

## When You Connect to Real Backend

When you're ready to connect to your real backend:

1. Update the import in `src/context/AuthContext.jsx` to use `ApiManager` instead of `authService`
2. Update the API endpoints in `src/services/ApiManager.js`
3. Remove or rename the mock `authService.js` file
