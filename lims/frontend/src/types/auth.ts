export type UserRole = 
  | 'superadmin' 
  | 'tenant-admin' 
  | 'doctor' 
  | 'technician' 
  | 'support' 
  | 'patient';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  tenant: string | null;
  isPaid: boolean;
  created_by: string | null;
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
    path: string;
    permission?: string;
  }>;
}>> = {
  'superadmin': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'Building2', label: 'Manage Tenants', path: '/manage-tenants' },
        { icon: 'Plus', label: 'Create Tenants', path: '/create-tenants' },
        { icon: 'Users', label: 'All Tenants', path: '/all-tenants' }
      ]
    },
    {
      title: 'ANALYTICS & BILLING',
      items: [
        { icon: 'BarChart3', label: 'Usage Analysis', path: '/usage-analysis' },
        { icon: 'DollarSign', label: 'Billing and Plans', path: '/billing-plans' }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { icon: 'Users', label: 'Admin Management', path: '/admin-management' },
        { icon: 'Activity', label: 'System Logs', path: '/system-logs' },
        { icon: 'Bell', label: 'Global Notification', path: '/global-notification' },
        { icon: 'Monitor', label: 'Monitor Online Users', path: '/monitor-users' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { icon: 'Database', label: 'Backup Database', path: '/backup-database' }
      ]
    }
  ],
  'tenant-admin': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'Users', label: 'User Management', path: '/users' },
        { icon: 'Building2', label: 'Tenant Settings', path: '/settings' },
        { icon: 'Package', label: 'Inventory Management', path: '/inventory' }
      ]
    },
    {
      title: 'TEST MANAGEMENT',
      items: [
        { icon: 'TestTube', label: 'Manage Tests', path: '/manage-tests' },
        { icon: 'Microscope', label: 'Cultures & Antibiotics', path: '/cultures-antibiotics' },
        { icon: 'Calculator', label: 'Test & Cultures Pricing', path: '/test-pricing' }
      ]
    },
    {
      title: 'PEOPLE MANAGEMENT',
      items: [
        { icon: 'UserCheck', label: 'Doctors Management', path: '/doctors' },
        { icon: 'UserPlus', label: 'Patient Management', path: '/patients' }
      ]
    },
    {
      title: 'REPORTS & ANALYTICS',
      items: [
        { icon: 'FileText', label: 'Test Reports', path: '/test-reports' },
        { icon: 'BarChart3', label: 'Analysis Dashboard', path: '/analytics' }
      ]
    },
    {
      title: 'SERVICES',
      items: [
        { icon: 'Printer', label: 'Receipts Printing', path: '/receipts' },
        { icon: 'Stethoscope', label: 'Home Visit Request', path: '/home-visit-requests' },
        { icon: 'CalendarIcon', label: 'Home Visit Schedule', path: '/home-visit-schedule' }
      ]
    },
    {
      title: 'ORGANIZATION',
      items: [
        { icon: 'MapPin', label: 'Branch Management', path: '/branches' },
        { icon: 'FileContract', label: 'Contract Management', path: '/contracts' },
        { icon: 'Receipt', label: 'Accounting', path: '/accounting' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { icon: 'Settings', label: 'Equipment', path: '/equipment' }
      ]
    }
  ],
  'doctor': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'FileText', label: 'Test Requests', path: '/test-requests' },
        { icon: 'Calendar', label: 'Appointments', path: '/appointments' },
        { icon: 'Users', label: 'Patients', path: '/patients' }
      ]
    },
    {
      title: 'PATIENT CARE',
      items: [
        { icon: 'ClipboardList', label: 'Test Results', path: '/test-results' },
        { icon: 'User', label: 'Patient Records', path: '/patient-records' },
        { icon: 'MessageSquare', label: 'Messages', path: '/messages' }
      ]
    }
  ],
  'technician': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'TestTube', label: 'Samples', path: '/samples' },
        { icon: 'Wrench', label: 'Equipment', path: '/equipment' },
        { icon: 'FileText', label: 'Test Reports', path: '/test-reports' }
      ]
    },
    {
      title: 'LAB WORK',
      items: [
        { icon: 'ClipboardCheck', label: 'Accept Samples', path: '/accept-samples' },
        { icon: 'Settings', label: 'Calibrations', path: '/calibrations' },
        { icon: 'AlertTriangle', label: 'Maintenance', path: '/maintenance' }
      ]
    }
  ],
  'support': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'Headphones', label: 'Support Tickets', path: '/support-tickets' },
        { icon: 'Package', label: 'Inventory', path: '/inventory' },
        { icon: 'Bell', label: 'Notifications', path: '/notifications' }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { icon: 'MessageSquare', label: 'Messages', path: '/messages' },
        { icon: 'FileText', label: 'Reports', path: '/reports' },
        { icon: 'Settings', label: 'Settings', path: '/settings' }
      ]
    }
  ],
  'patient': [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'Calendar', label: 'My Appointments', path: '/appointments' },
        { icon: 'FileText', label: 'Test Results', path: '/test-results' },
        { icon: 'User', label: 'Profile', path: '/profile' }
      ]
    },
    {
      title: 'SERVICES',
      items: [
        { icon: 'BookOpen', label: 'FAQ', path: '/faq' },
        { icon: 'MessageSquare', label: 'Support', path: '/support' },
        { icon: 'HelpCircle', label: 'Help', path: '/help' }
      ]
    }
  ]
};
