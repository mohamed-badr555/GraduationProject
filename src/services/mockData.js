// Mock Data Service for ovoVax - Frontend Development
// This provides mock data until backend is implemented

export const mockData = {
  // User data
  user: {
    id: 1,
    firstName: 'Ahmed',
    lastName: 'Alaa',
    email: 'ahmed@ovovax.com',
    role: 'Administrator',
    avatar: null,
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
    }
  },

  // Dashboard statistics
  dashboardStats: {
    totalEggs: 10000,
    vaccinatedEggs: 8500,
    systemUptime: '99.8%',
    activeProcesses: 3,
    todayVaccinations: 450,
    successRate: 98.2,
    alertsCount: 2,
    systemStatus: 'active'
  },

  // Environmental data
  environmentalData: {
    temperature: 37.5,
    humidity: 65,
    airFlow: 'Normal',
    pressure: 1013.25,
    lastUpdate: new Date().toISOString(),
    status: 'optimal'
  },

  // Egg array status
  eggArray: Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    position: {
      row: Math.floor(index / 10) + 1,
      column: (index % 10) + 1
    },
    status: ['healthy', 'vaccinated', 'infected', 'empty'][Math.floor(Math.random() * 4)],
    vaccinationDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    detectionConfidence: Math.random() * 40 + 60 // 60-100%
  })),

  // Vaccination sessions
  vaccinationSessions: [
    {
      id: 1,
      name: 'Morning Batch A',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      totalEggs: 500,
      vaccinatedEggs: 485,
      status: 'completed',
      successRate: 97.0,
      operator: 'System Auto'
    },
    {
      id: 2,
      name: 'Afternoon Batch B',
      startTime: new Date().toISOString(),
      endTime: null,
      totalEggs: 300,
      vaccinatedEggs: 150,
      status: 'in_progress',
      successRate: null,
      operator: 'Ahmed Alaa'
    },
    {
      id: 3,
      name: 'Evening Batch C',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      endTime: null,
      totalEggs: 400,
      vaccinatedEggs: 0,
      status: 'scheduled',
      successRate: null,
      operator: 'System Auto'
    }
  ],

  // Alerts
  alerts: [
    {
      id: 1,
      type: 'warning',
      title: 'Temperature Alert',
      message: 'Incubation temperature is slightly above optimal range (38.2°C)',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'unread',
      priority: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Vaccination Complete',
      message: 'Morning Batch A vaccination completed successfully (97% success rate)',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'read',
      priority: 'low'
    },
    {
      id: 3,
      type: 'error',
      title: 'System Error',
      message: 'Vaccination needle calibration required',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'unread',
      priority: 'high'
    }
  ],

  // Analytics data
  analyticsData: {
    vaccinationTrend: [
      { date: '2024-01-01', count: 450 },
      { date: '2024-01-02', count: 480 },
      { date: '2024-01-03', count: 420 },
      { date: '2024-01-04', count: 510 },
      { date: '2024-01-05', count: 495 },
      { date: '2024-01-06', count: 520 },
      { date: '2024-01-07', count: 485 }
    ],
    successRateTrend: [
      { date: '2024-01-01', rate: 96.5 },
      { date: '2024-01-02', rate: 97.2 },
      { date: '2024-01-03', rate: 95.8 },
      { date: '2024-01-04', rate: 98.1 },
      { date: '2024-01-05', rate: 97.8 },
      { date: '2024-01-06', rate: 98.5 },
      { date: '2024-01-07', rate: 97.9 }
    ],
    systemPerformance: {
      cpu: 45,
      memory: 68,
      storage: 32,
      network: 89
    }
  },

  // Reports
  reports: [
    {
      id: 1,
      name: 'Daily Vaccination Report',
      type: 'daily',
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      fileSize: '2.4 MB',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Weekly Performance Summary',
      type: 'weekly',
      generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      fileSize: '15.7 MB',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'System Health Report',
      type: 'system',
      generatedAt: new Date().toISOString(),
      status: 'generating',
      fileSize: null,
      downloadUrl: null
    }
  ],

  // Settings
  settings: {
    system: {
      vaccinationSpeed: 'medium',
      temperatureRange: { min: 36.5, max: 38.0 },
      humidityRange: { min: 55, max: 70 },
      autoReports: true,
      alertThresholds: {
        temperature: 0.5,
        humidity: 5,
        pressure: 10
      }
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      alertTypes: ['error', 'warning']
    },
    maintenance: {
      lastCalibration: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextMaintenance: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
      autoMaintenance: true
    }
  }
};

// Mock API delay to simulate network requests
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Authentication
  async login(credentials) {
    await delay();
    if (credentials.email === 'admin@ovovax.com' && credentials.password === 'admin123') {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: mockData.user
      };
    }
    throw new Error('Invalid credentials');
  },
  async register(userData) {
    await delay();
    return {
      success: true,
      message: 'Registration successful',
      user: { 
        ...mockData.user, 
        ...userData, 
        id: Date.now(),
        organization: 'ovoVax Systems', // Default organization
        role: 'operator' // Default role
      }
    };
  },

  async validateToken(token) {
    await delay(200);
    if (token && token.startsWith('mock-jwt-token')) {
      return { success: true, user: mockData.user };
    }
    throw new Error('Invalid token');
  },

  // Dashboard
  async getDashboardStats() {
    await delay();
    return mockData.dashboardStats;
  },

  async getSystemStatus() {
    await delay();
    return {
      status: 'operational',
      uptime: '99.8%',
      lastUpdate: new Date().toISOString()
    };
  },

  // Environmental
  async getEnvironmentalData() {
    await delay();
    return mockData.environmentalData;
  },

  // Eggs
  async getEggArrayStatus() {
    await delay();
    return mockData.eggArray;
  },

  // Vaccination
  async getVaccinationSessions() {
    await delay();
    return mockData.vaccinationSessions;
  },

  async createVaccinationSession(sessionData) {
    await delay();
    const newSession = {
      id: Date.now(),
      ...sessionData,
      status: 'scheduled',
      vaccinatedEggs: 0,
      successRate: null
    };
    return newSession;
  },

  // Alerts
  async getAlerts() {
    await delay();
    return mockData.alerts;
  },

  async markAlertAsRead(alertId) {
    await delay();
    return { success: true, message: 'Alert marked as read' };
  },

  // Analytics
  async getAnalyticsData() {
    await delay();
    return mockData.analyticsData;
  },

  // Reports
  async getReports() {
    await delay();
    return mockData.reports;
  },

  async generateReport(reportParams) {
    await delay(2000); // Simulate longer generation time
    return {
      success: true,
      reportId: Date.now(),
      message: 'Report generation started'
    };
  },

  // Settings
  async getSettings() {
    await delay();
    return mockData.settings;
  },

  async updateSettings(newSettings) {
    await delay();
    return {
      success: true,
      settings: { ...mockData.settings, ...newSettings }
    };
  }
};

export default mockApi;
