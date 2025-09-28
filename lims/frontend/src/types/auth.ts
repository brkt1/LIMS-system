export type UserRole = 
  | 'superadmin' 
  | 'tenant-admin' 
  | 'doctor' 
  | 'technician' 
  | 'support' 
  | 'patient';

export interface User {
  [x: string]: string;
  firstName: string;
  lastName: string;
  name: string;
  first_name: string;
  last_name: string;
  username: string;
  id: number;
  email: string;
  role: UserRole;
  tenant: string | null;
  isPaid: boolean;
  created_by: string | null;
  profile_picture?: string | null;
}

export interface Tenant {
  name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  tenant: Tenant | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'superadmin': [
    'manage_tenants',
    'manage_all_users',
    'view_all_analytics',
    'manage_system_settings',
    'view_all_data'
  ],
  'tenant-admin': [
    'manage_tenant_users',
    'manage_tenant_settings',
    'view_tenant_analytics',
    'manage_tenant_inventory',
    'manage_tenant_equipment',
    'view_tenant_reports'
  ],
  'doctor': [
    'create_test_requests',
    'view_patient_data',
    'manage_appointments',
    'view_test_results',
    'manage_patient_records'
  ],
  'technician': [
    'process_samples',
    'manage_equipment',
    'create_test_reports',
    'view_equipment_status',
    'manage_calibrations'
  ],
  'support': [
    'view_support_tickets',
    'manage_support_requests',
    'view_system_logs',
    'manage_notifications',
    'view_inventory_status'
  ],
  'patient': [
    'view_own_appointments',
    'view_own_test_results',
    'book_appointments',
    'view_own_profile'
  ]
};

// Role-based navigation items
export const ROLE_NAVIGATION: Record<UserRole, Array<{
  title: string;
  items: Array<{
    icon: string;
    label: string;
    labelKey: string;
    path: string;
    permission?: string;
  }>;
}>> = {
  'superadmin': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', labelKey: 'nav.dashboard', path: '/dashboard' },
        { icon: 'Building2', label: 'Manage Tenants', labelKey: 'nav.manageTenants', path: '/manage-tenants' },
        { icon: 'Plus', label: 'Create Tenants', labelKey: 'nav.createTenants', path: '/create-tenants' },
        { icon: 'Users', label: 'All Tenants', labelKey: 'nav.allTenants', path: '/all-tenants' }
      ]
    },
    {
      title: 'ANALYTICS & BILLING',
      items: [
        { icon: 'BarChart3', label: 'Usage Analysis', labelKey: 'nav.usageAnalysis', path: '/usage-analysis' },
        { icon: 'DollarSign', label: 'Billing and Plans', labelKey: 'nav.billingPlans', path: '/billing-plans' }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { icon: 'Users', label: 'Admin Management', labelKey: 'nav.adminManagement', path: '/admin-management' },
        { icon: 'Activity', label: 'System Logs', labelKey: 'nav.systemLogs', path: '/system-logs' },
        { icon: 'Bell', label: 'Global Notification', labelKey: 'nav.globalNotification', path: '/global-notification' },
        { icon: 'Monitor', label: 'Monitor Online Users', labelKey: 'nav.monitorUsers', path: '/monitor-users' }
      ]
    },
  ],
  'tenant-admin': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', labelKey: 'nav.dashboard', path: '/dashboard' },
        { icon: 'Users', label: 'User Management', labelKey: 'nav.userManagement', path: '/users' },
        { icon: 'Building2', label: 'Tenant Settings', labelKey: 'nav.tenantSettings', path: '/settings' },
        { icon: 'Package', label: 'Inventory Management', labelKey: 'nav.inventoryManagement', path: '/inventory' }
      ]
    },
    {
      title: 'TEST MANAGEMENT',
      items: [
        { icon: 'TestTube', label: 'Manage Tests', labelKey: 'nav.manageTests', path: '/manage-tests' },
        { icon: 'Microscope', label: 'Cultures & Antibiotics', labelKey: 'nav.culturesAntibiotics', path: '/cultures-antibiotics' },
        { icon: 'Calculator', label: 'Test & Cultures Pricing', labelKey: 'nav.testPricing', path: '/test-pricing' }
      ]
    },
    {
      title: 'PEOPLE MANAGEMENT',
      items: [
        { icon: 'UserCheck', label: 'Doctors Management', labelKey: 'nav.doctorsManagement', path: '/doctors' },
        { icon: 'UserPlus', label: 'Patient Management', labelKey: 'nav.patientManagement', path: '/patients' }
      ]
    },
    {
      title: 'REPORTS & ANALYTICS',
      items: [
        { icon: 'FileText', label: 'Test Reports', labelKey: 'nav.testReports', path: '/test-reports' },
        { icon: 'BarChart3', label: 'Analysis Dashboard', labelKey: 'nav.analysisDashboard', path: '/analytics' }
      ]
    },
    {
      title: 'SERVICES',
      items: [
        { icon: 'Printer', label: 'Receipts Printing', labelKey: 'nav.receiptsPrinting', path: '/receipts' },
        { icon: 'Stethoscope', label: 'Home Visit Request', labelKey: 'nav.homeVisitRequest', path: '/home-visit-requests' },
        { icon: 'CalendarIcon', label: 'Home Visit Schedule', labelKey: 'nav.homeVisitSchedule', path: '/home-visit-schedule' }
      ]
    },
    {
      title: 'ORGANIZATION',
      items: [
        { icon: 'MapPin', label: 'Branch Management', labelKey: 'nav.branchManagement', path: '/branches' },
        { icon: 'FileContract', label: 'Contract Management', labelKey: 'nav.contractManagement', path: '/contracts' },
        { icon: 'Receipt', label: 'Accounting', labelKey: 'nav.accounting', path: '/accounting' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { icon: 'Settings', label: 'Equipment', labelKey: 'nav.equipment', path: '/equipment' }
      ]
    }
  ],
  'doctor': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', labelKey: 'nav.dashboard', path: '/dashboard' },
        { icon: 'FileText', label: 'Test Requests', labelKey: 'nav.testRequests', path: '/test-requests' },
        { icon: 'Calendar', label: 'Appointments', labelKey: 'nav.appointments', path: '/appointments' },
        { icon: 'Users', label: 'Patients', labelKey: 'nav.patients', path: '/patients' }
      ]
    },
    {
      title: 'PATIENT CARE',
      items: [
        { icon: 'ClipboardList', label: 'Test Results', labelKey: 'nav.testResults', path: '/test-results' },
        { icon: 'User', label: 'Patient Records', labelKey: 'nav.patientRecords', path: '/patient-records' },
        { icon: 'MessageSquare', label: 'Messages', labelKey: 'nav.messages', path: '/messages' }
      ]
    }
  ],
  'technician': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', labelKey: 'nav.dashboard', path: '/dashboard' },
        { icon: 'TestTube', label: 'Samples', labelKey: 'nav.samples', path: '/samples' },
        { icon: 'Wrench', label: 'Equipment', labelKey: 'nav.equipment', path: '/equipment' },
        { icon: 'FileText', label: 'Test Reports', labelKey: 'nav.testReports', path: '/test-reports' }
      ]
    },
    {
      title: 'LAB WORK',
      items: [
        { icon: 'ClipboardCheck', label: 'Accept Samples', labelKey: 'nav.acceptSamples', path: '/accept-samples' },
        { icon: 'Settings', label: 'Calibrations', labelKey: 'nav.calibrations', path: '/calibrations' },
        { icon: 'AlertTriangle', label: 'Maintenance', labelKey: 'nav.maintenance', path: '/maintenance' }
      ]
    }
  ],
  'support': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', labelKey: 'nav.dashboard', path: '/dashboard' },
        { icon: 'Headphones', label: 'Support Tickets', labelKey: 'nav.supportTickets', path: '/support-tickets' },
        { icon: 'Package', label: 'Inventory', labelKey: 'nav.inventory', path: '/inventory' },
        { icon: 'Bell', label: 'Notifications', labelKey: 'nav.notifications', path: '/notifications' },
        { icon: 'User', label: 'Profile', labelKey: 'nav.profile', path: '/profile' }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { icon: 'MessageSquare', label: 'Messages', labelKey: 'nav.messages', path: '/messages' },
        { icon: 'FileText', label: 'Reports', labelKey: 'nav.reports', path: '/reports' }
      ]
    }
  ],
  'patient': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', labelKey: 'nav.dashboard', path: '/dashboard' },
        { icon: 'Calendar', label: 'My Appointments', labelKey: 'nav.myAppointments', path: '/appointments' },
        { icon: 'FileText', label: 'Test Results', labelKey: 'nav.testResults', path: '/test-results' },
        { icon: 'User', label: 'Profile', labelKey: 'nav.profile', path: '/profile' }
      ]
    },
    {
      title: 'SERVICES',
      items: [
        { icon: 'BookOpen', label: 'FAQ', labelKey: 'nav.faq', path: '/faq' },
        { icon: 'MessageSquare', label: 'Support', labelKey: 'nav.support', path: '/support' },
        { icon: 'HelpCircle', label: 'Help', labelKey: 'nav.help', path: '/help' }
      ]
    }
  ]
};
