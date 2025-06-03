// Mock authentication service for development
// In production, this would connect to your actual API

// Mock users database
const MOCK_USERS = [
  {
    id: 1,
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@ovovax.com',
    password: 'password123', // In real app, this would be hashed
    organization: 'PoultryTech Research',
    role: 'veterinarian'
  },
  {
    id: 2,
    firstName: 'Ahmed',
    lastName: 'Alaa',
    email: 'ahmed@ovovax.com',
    password: 'admin123',
    organization: 'ovoVax Systems',
    role: 'administrator'
  },
  {
    id: 3,
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@ovovax.com',
    password: 'demo123',
    organization: 'Demo Organization',
    role: 'operator'
  }
];

const MOCK_TOKEN = 'mock-jwt-token-12345';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {  async login(email, password) {
    await delay(800); // Simulate network delay
    
    // Find user by email and validate password
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Don't include password in response
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword,
        token: MOCK_TOKEN
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password'
    };
  },
  async register(userData) {
    await delay(1000); // Simulate network delay
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }
    
    // Validate required fields
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return {
        success: false,
        error: 'Please fill in all required fields'
      };
    }
    
    // Create new user
    const newUser = {
      id: MOCK_USERS.length + 1,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      organization: userData.organization || 'ovoVax Systems',
      role: userData.role || 'operator'
    };
    
    // Add to mock database
    MOCK_USERS.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      success: true,
      user: userWithoutPassword,
      token: MOCK_TOKEN
    };
  },

  async forgotPassword(email) {
    await delay(600); // Simulate network delay
    
    if (email) {
      return {
        success: true
      };
    }
    
    return {
      success: false,
      error: 'Please enter a valid email address'
    };
  },
  async validateToken(token) {
    await delay(300); // Simulate network delay
    
    if (token === MOCK_TOKEN) {
      // Return the first user as default (in real app, token would contain user info)
      const { password: _, ...userWithoutPassword } = MOCK_USERS[0];
      return {
        success: true,
        user: userWithoutPassword
      };
    }
    
    return {
      success: false,
      error: 'Invalid token'
    };
  }
};
