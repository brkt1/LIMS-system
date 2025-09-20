# Role-Based Access Control (RBAC) System

This document describes the comprehensive role-based access control system implemented in the LIMS frontend.

## 🎯 Overview

The LIMS system implements a sophisticated role-based access control system that provides different interfaces and permissions based on user roles. Each role has access to specific features, data, and functionality.

## 👥 User Roles

### 1. **Super Admin** (`superadmin`)
- **Purpose**: System-wide administration and management
- **Access**: Full system control, tenant management, global analytics
- **Key Features**:
  - Manage all tenants and organizations
  - View global system analytics and reports
  - Manage system settings and configurations
  - Monitor system health and performance
  - Access all user data across tenants

### 2. **Tenant Admin** (`tenant-admin`)
- **Purpose**: Organization-level management
- **Access**: Tenant-specific administration and user management
- **Key Features**:
  - Manage tenant users and permissions
  - Configure tenant settings and preferences
  - View tenant-specific analytics and reports
  - Manage tenant inventory and equipment
  - Oversee tenant operations

### 3. **Doctor** (`doctor`)
- **Purpose**: Patient care and medical management
- **Access**: Patient data, test requests, and medical records
- **Key Features**:
  - Create and manage test requests
  - View patient information and history
  - Manage appointments and schedules
  - Review and interpret test results
  - Maintain patient records

### 4. **Technician** (`technician`)
- **Purpose**: Laboratory operations and sample processing
- **Access**: Lab equipment, samples, and test processing
- **Key Features**:
  - Process and manage samples
  - Operate and maintain lab equipment
  - Create test reports and documentation
  - Manage equipment calibrations
  - Track sample status and results

### 5. **Support Staff** (`support`)
- **Purpose**: Customer support and system assistance
- **Access**: Support tickets, notifications, and user assistance
- **Key Features**:
  - Handle support tickets and requests
  - Manage system notifications
  - Monitor inventory status
  - Assist users with system issues
  - Generate support reports

### 6. **Patient** (`patient`)
- **Purpose**: Self-service patient portal
- **Access**: Personal data, appointments, and test results
- **Key Features**:
  - View personal appointments
  - Access test results and reports
  - Book and manage appointments
  - Update personal information
  - Access FAQ and support resources

## 🔐 Authentication Flow

### Login Process
1. User enters email and password
2. System authenticates against Django backend
3. JWT tokens are generated and stored
4. User role and permissions are loaded
5. Appropriate dashboard is displayed

### Token Management
- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token for token renewal
- **Auto-refresh**: Automatic token renewal on expiration
- **Secure Storage**: Tokens stored in localStorage with encryption

## 🎨 Role-Based UI Components

### Navigation Sidebar
Each role has a customized sidebar with relevant navigation items:

```typescript
// Example: Doctor navigation
{
  title: 'MAIN MENU',
  items: [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'FileText', label: 'Test Requests', path: '/test-requests' },
    { icon: 'Calendar', label: 'Appointments', path: '/appointments' },
    { icon: 'Users', label: 'Patients', path: '/patients' }
  ]
}
```

### Dashboard Views
Each role has a specialized dashboard with relevant metrics and data:

- **Super Admin**: System-wide metrics, tenant overview, global analytics
- **Tenant Admin**: Tenant-specific metrics, user management, operations
- **Doctor**: Patient care metrics, test requests, appointments
- **Technician**: Lab operations, equipment status, sample processing
- **Support**: Support tickets, system notifications, user assistance
- **Patient**: Personal appointments, test results, profile management

## 🛡️ Permission System

### Permission Structure
```typescript
const ROLE_PERMISSIONS = {
  'superadmin': [
    'manage_tenants',
    'manage_all_users',
    'view_all_analytics',
    'manage_system_settings',
    'view_all_data'
  ],
  'doctor': [
    'create_test_requests',
    'view_patient_data',
    'manage_appointments',
    'view_test_results',
    'manage_patient_records'
  ],
  // ... other roles
};
```

### Permission Checking
```typescript
// Check if user has specific role
const isDoctor = hasRole('doctor');

// Check if user has any of multiple roles
const isAdmin = hasRole(['superadmin', 'tenant-admin']);

// Check if user has specific permission
const canManageUsers = hasPermission('manage_all_users');
```

## 🔧 Implementation Details

### Context Provider
The `AuthProvider` wraps the entire application and provides:
- User authentication state
- Role and permission checking
- Login/logout functionality
- Token management

### Route Protection
Routes are protected based on user roles and permissions:
```typescript
// Example: Protected route component
const ProtectedRoute = ({ requiredRole, children }) => {
  const { hasRole } = useAuth();
  
  if (!hasRole(requiredRole)) {
    return <AccessDenied />;
  }
  
  return children;
};
```

### API Integration
All API calls include authentication headers:
```typescript
// Automatic token inclusion
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🎯 Role-Specific Features

### Super Admin Features
- **Tenant Management**: Create, update, delete tenants
- **Global Analytics**: System-wide performance metrics
- **User Management**: Manage all users across tenants
- **System Settings**: Configure global system parameters
- **Audit Logs**: View system activity and changes

### Tenant Admin Features
- **User Management**: Manage tenant users and roles
- **Tenant Settings**: Configure organization preferences
- **Analytics**: View tenant-specific metrics and reports
- **Inventory Management**: Manage equipment and supplies
- **Operations**: Oversee daily operations

### Doctor Features
- **Test Requests**: Create and manage test requests
- **Patient Records**: View and update patient information
- **Appointments**: Manage patient appointments
- **Test Results**: Review and interpret test results
- **Patient Communication**: Send messages and updates

### Technician Features
- **Sample Processing**: Process and track samples
- **Equipment Management**: Operate and maintain lab equipment
- **Test Reports**: Create detailed test reports
- **Calibrations**: Manage equipment calibrations
- **Quality Control**: Ensure test accuracy and reliability

### Support Features
- **Ticket Management**: Handle support requests
- **User Assistance**: Help users with system issues
- **Notifications**: Manage system notifications
- **Inventory Status**: Monitor equipment and supplies
- **Reports**: Generate support and usage reports

### Patient Features
- **Appointment Booking**: Schedule and manage appointments
- **Test Results**: View personal test results
- **Profile Management**: Update personal information
- **Communication**: Contact healthcare providers
- **Resources**: Access FAQ and help materials

## 🚀 Getting Started

### 1. Start the Development Server
```bash
cd lims/frontend
npm run dev
```

### 2. Access the Application
Open your browser and navigate to `http://localhost:3001`

### 3. Login with Test Credentials
The system will show a login form. You can test with different roles by creating users in the Django admin.

### 4. Explore Role-Based Features
Each role will show a different interface with relevant features and navigation.

## 🔒 Security Considerations

### Token Security
- Tokens are stored securely in localStorage
- Automatic token refresh prevents session expiration
- Logout clears all stored authentication data

### Permission Validation
- All permissions are validated on both frontend and backend
- API endpoints enforce role-based access control
- Sensitive operations require additional verification

### Data Isolation
- Tenant data is isolated based on user's tenant
- Users can only access data they're authorized to see
- Cross-tenant data access is prevented

## 📱 Responsive Design

The role-based system is fully responsive and works on:
- **Desktop**: Full sidebar and detailed views
- **Tablet**: Collapsible sidebar with touch-friendly interface
- **Mobile**: Compact navigation with essential features

## 🎨 Customization

### Adding New Roles
1. Add role to `UserRole` type in `types/auth.ts`
2. Define permissions in `ROLE_PERMISSIONS`
3. Create navigation structure in `ROLE_NAVIGATION`
4. Implement role-specific dashboard component
5. Update `RoleBasedDashboard` component

### Modifying Permissions
1. Update `ROLE_PERMISSIONS` in `types/auth.ts`
2. Implement permission checking logic
3. Update UI components to respect new permissions
4. Test with different user roles

## 🧪 Testing

### Role Testing
Test each role by:
1. Creating users with different roles in Django admin
2. Logging in with each role
3. Verifying correct navigation and features are shown
4. Testing permission-based access control

### Permission Testing
Test permissions by:
1. Attempting to access restricted features
2. Verifying proper access denied messages
3. Testing API endpoint access
4. Validating data isolation

## 📚 API Endpoints

### Authentication
- `POST /api/login/` - User login
- `POST /api/token/refresh/` - Refresh JWT token

### Role-Specific Endpoints
Each role has access to specific API endpoints based on their permissions and responsibilities.

## 🔄 Future Enhancements

### Planned Features
- **Multi-tenant Support**: Enhanced tenant isolation
- **Advanced Permissions**: Granular permission system
- **Audit Logging**: Comprehensive activity tracking
- **SSO Integration**: Single sign-on support
- **Mobile App**: Native mobile application

### Scalability
- **Microservices**: Break down into smaller services
- **Caching**: Implement Redis for better performance
- **CDN**: Content delivery network for static assets
- **Load Balancing**: Distribute traffic across servers

This role-based system provides a secure, scalable, and user-friendly interface for the LIMS application, ensuring that each user type has access to the appropriate features and data while maintaining security and data integrity.
