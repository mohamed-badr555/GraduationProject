import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Component/Layout/DashboardLayout';
import SystemStatus from '../Component/Dashboard/SystemStatus';
import EggArray from '../Component/Dashboard/EggArray';
import EnvironmentalParams from '../Component/Dashboard/EnvironmentalParams';

import Statistics from '../Component/Dashboard/Statistics';

// Mock data generator functions
const generateEnvironmentalData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    data.push({
      temperature: 25 + Math.random() * 5,
      humidity: 45 + Math.random() * 10,
      liquidLevel: 80 + Math.random() * 20,
      timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
    });
  }
  return data;
};

const generateEggData = () => {
  const eggs = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      eggs.push({
        id: `egg-${row}-${col}`,
        arrayPosition: { row, column: col },
        injectionStatus: Math.random() > 0.9 
          ? 'failed' 
          : Math.random() > 0.8 
          ? 'skipped' 
          : 'success',
        timestamp: new Date().toISOString(),
      });
    }
  }
  return eggs;
};

export default function Dashboard() {
  const [environmentalData, setEnvironmentalData] = useState([]);
  const [eggs, setEggs] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    isActive: true,
    totalEggs: 9,
    successfulInjections: 6,
    failedInjections: 2,
    skippedEggs: 1,
  });

  useEffect(() => {
    setEnvironmentalData(generateEnvironmentalData());
    setEggs(generateEggData());
  }, []);
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8 space-y-4 lg:space-y-6">
          <SystemStatus />
          <EggArray />
        </div>
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          <EnvironmentalParams />
          <Statistics />
        </div>
      </div>
    </DashboardLayout>
  );
} 