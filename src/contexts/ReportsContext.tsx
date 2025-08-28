import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'safety' | 'environment' | 'health' | 'education' | 'other';
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  location: string;
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  imageUrl?: string;
}

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'reportedAt'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  searchReports: (query: string) => Report[];
  filterReports: (category?: string, status?: string) => Report[];
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

const REPORTS_STORAGE_KEY = 'digibaryo_reports';

// Mock initial data
const initialReports: Report[] = [
  {
    id: '1',
    title: 'Broken Street Light on Main Road',
    description: 'The street light near the church has been flickering and completely went out last night. This area becomes very dark and unsafe for residents walking at night.',
    category: 'infrastructure',
    status: 'pending',
    priority: 'high',
    location: 'Main Road, near St. Joseph Church',
    reportedBy: 'Maria Santos',
    reportedAt: '2024-08-27T10:30:00Z',
  },
  {
    id: '2',
    title: 'Stray Dogs in Residential Area',
    description: 'Multiple stray dogs have been roaming around Purok 3. They seem friendly but residents are concerned about safety, especially for children.',
    category: 'safety',
    status: 'in-progress',
    priority: 'medium',
    location: 'Purok 3, Residential Area',
    reportedBy: 'Juan dela Cruz',
    reportedAt: '2024-08-26T14:15:00Z',
  },
  {
    id: '3',
    title: 'Pothole on Barangay Road',
    description: 'Large pothole formed after the recent heavy rains. It\'s causing damage to vehicles and making the road dangerous, especially for motorcycles.',
    category: 'infrastructure',
    status: 'pending',
    priority: 'high',
    location: 'Barangay Road, near Elementary School',
    reportedBy: 'Ana Reyes',
    reportedAt: '2024-08-25T16:45:00Z',
  },
  {
    id: '4',
    title: 'Illegal Dumping in Creek Area',
    description: 'People have been throwing garbage in the creek behind the basketball court. This is causing water pollution and bad smell in the area.',
    category: 'environment',
    status: 'resolved',
    priority: 'medium',
    location: 'Creek behind Basketball Court',
    reportedBy: 'Roberto Cruz',
    reportedAt: '2024-08-24T09:20:00Z',
    resolvedAt: '2024-08-28T11:00:00Z',
  },
  {
    id: '5',
    title: 'Need Health Center Supplies',
    description: 'The barangay health center is running low on basic medical supplies like first aid kits, thermometers, and blood pressure monitors.',
    category: 'health',
    status: 'in-progress',
    priority: 'medium',
    location: 'Barangay Health Center',
    reportedBy: 'Dr. Elena Gonzales',
    reportedAt: '2024-08-23T08:00:00Z',
  },
];

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Load reports from localStorage or use initial data
    const savedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      setReports(initialReports);
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(initialReports));
    }
  }, []);

  const saveReports = (updatedReports: Report[]) => {
    setReports(updatedReports);
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
  };

  const addReport = (reportData: Omit<Report, 'id' | 'reportedAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      reportedAt: new Date().toISOString(),
    };
    
    const updatedReports = [newReport, ...reports];
    saveReports(updatedReports);
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    const updatedReports = reports.map(report =>
      report.id === id ? { ...report, ...updates } : report
    );
    saveReports(updatedReports);
  };

  const searchReports = (query: string): Report[] => {
    if (!query.trim()) return reports;
    
    const lowercaseQuery = query.toLowerCase();
    return reports.filter(report =>
      report.title.toLowerCase().includes(lowercaseQuery) ||
      report.description.toLowerCase().includes(lowercaseQuery) ||
      report.location.toLowerCase().includes(lowercaseQuery) ||
      report.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filterReports = (category?: string, status?: string): Report[] => {
    return reports.filter(report => {
      const categoryMatch = !category || report.category === category;
      const statusMatch = !status || report.status === status;
      return categoryMatch && statusMatch;
    });
  };

  const value = {
    reports,
    addReport,
    updateReport,
    searchReports,
    filterReports,
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};