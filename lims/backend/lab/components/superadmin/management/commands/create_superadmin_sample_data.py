from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
import random

from lab.components.superadmin.models import (
    Tenant, BillingPlan, TenantPlan, BillingTransaction, 
    UsageMetrics, SystemLog, SystemHealth
)


class Command(BaseCommand):
    help = 'Create sample data for SuperAdmin components'

    def handle(self, *args, **options):
        self.stdout.write('Creating SuperAdmin sample data...')

        # Create billing plans
        plans_data = [
            {
                'name': 'Basic',
                'plan_type': 'basic',
                'price': 29.00,
                'billing_cycle': 'monthly',
                'max_users': 10,
                'features': ['Basic Dashboard', 'Standard Support', 'Up to 10 users', 'Basic Analytics', 'Email Support']
            },
            {
                'name': 'Professional',
                'plan_type': 'professional',
                'price': 79.00,
                'billing_cycle': 'monthly',
                'max_users': 50,
                'features': ['Advanced Dashboard', 'Priority Support', 'Up to 50 users', 'Advanced Analytics', 'API Access', 'Phone Support']
            },
            {
                'name': 'Enterprise',
                'plan_type': 'enterprise',
                'price': 199.00,
                'billing_cycle': 'monthly',
                'max_users': 200,
                'features': ['Full Dashboard Suite', 'Dedicated Support', 'Unlimited users', 'Custom Analytics', 'Full API Access', 'Custom Branding', '24/7 Support']
            }
        ]

        plans = []
        for plan_data in plans_data:
            plan, created = BillingPlan.objects.get_or_create(
                name=plan_data['name'],
                defaults=plan_data
            )
            plans.append(plan)
            if created:
                self.stdout.write(f'Created plan: {plan.name}')

        # Create tenants
        tenants_data = [
            {
                'company_name': 'MedLab Solutions',
                'domain': 'medlab',
                'email': 'admin@medlab.com',
                'status': 'active',
                'max_users': 45,
                'current_users': 45,
                'created_by': 'SuperAdmin'
            },
            {
                'company_name': 'City Hospital Lab',
                'domain': 'cityhospital',
                'email': 'admin@cityhospital.com',
                'status': 'active',
                'max_users': 78,
                'current_users': 78,
                'created_by': 'SuperAdmin'
            },
            {
                'company_name': 'Private Clinic Network',
                'domain': 'pcn',
                'email': 'admin@pcn.com',
                'status': 'suspended',
                'max_users': 23,
                'current_users': 23,
                'created_by': 'SuperAdmin'
            },
            {
                'company_name': 'Research Institute',
                'domain': 'research',
                'email': 'admin@research.com',
                'status': 'active',
                'max_users': 156,
                'current_users': 156,
                'created_by': 'SuperAdmin'
            },
            {
                'company_name': 'Diagnostic Center',
                'domain': 'diagnostic',
                'email': 'admin@diagnostic.com',
                'status': 'pending',
                'max_users': 12,
                'current_users': 12,
                'created_by': 'SuperAdmin'
            },
            {
                'company_name': 'Medical Group',
                'domain': 'medicalgroup',
                'email': 'admin@medicalgroup.com',
                'status': 'active',
                'max_users': 67,
                'current_users': 67,
                'created_by': 'SuperAdmin'
            }
        ]

        tenants = []
        for tenant_data in tenants_data:
            tenant, created = Tenant.objects.get_or_create(
                company_name=tenant_data['company_name'],
                defaults=tenant_data
            )
            tenants.append(tenant)
            if created:
                self.stdout.write(f'Created tenant: {tenant.company_name}')

        # Assign plans to tenants
        plan_assignments = [
            (0, 1),  # MedLab Solutions -> Professional
            (1, 2),  # City Hospital Lab -> Enterprise
            (2, 0),  # Private Clinic Network -> Basic
            (3, 2),  # Research Institute -> Enterprise
            (4, 0),  # Diagnostic Center -> Basic
            (5, 1),  # Medical Group -> Professional
        ]

        for tenant_idx, plan_idx in plan_assignments:
            tenant = tenants[tenant_idx]
            plan = plans[plan_idx]
            
            tenant_plan, created = TenantPlan.objects.get_or_create(
                tenant=tenant,
                defaults={
                    'billing_plan': plan,
                    'is_active': True,
                    'auto_renew': True
                }
            )
            if created:
                self.stdout.write(f'Assigned plan {plan.name} to {tenant.company_name}')

        # Create billing transactions
        for tenant in tenants:
            for i in range(random.randint(1, 3)):
                transaction = BillingTransaction.objects.create(
                    tenant=tenant,
                    billing_plan=tenant.plan.billing_plan,
                    amount=tenant.plan.billing_plan.price,
                    status=random.choice(['paid', 'pending', 'failed']),
                    payment_method=random.choice(['credit_card', 'bank_transfer', 'paypal']),
                    transaction_id=f'TXN-{tenant.id}-{i+1}-{random.randint(1000, 9999)}',
                    created_at=timezone.now() - timedelta(days=random.randint(1, 30))
                )

        # Create usage metrics
        for tenant in tenants:
            for i in range(30):  # Last 30 days
                date = timezone.now().date() - timedelta(days=i)
                UsageMetrics.objects.get_or_create(
                    tenant=tenant,
                    date=date,
                    defaults={
                        'active_users': random.randint(tenant.current_users // 2, tenant.current_users),
                        'total_tests': random.randint(50, 500),
                        'total_reports': random.randint(40, 450),
                        'api_calls': random.randint(100, 2000),
                        'storage_used': random.randint(1000000, 100000000),  # 1MB to 100MB
                        'bandwidth_used': random.randint(10000000, 1000000000),  # 10MB to 1GB
                    }
                )

        # Create system logs
        log_actions = ['login', 'logout', 'create_test', 'view_report', 'update_profile', 'system_startup']
        log_levels = ['info', 'warning', 'error']
        
        for i in range(100):
            SystemLog.objects.create(
                level=random.choice(log_levels),
                message=f'System log message {i+1}',
                action=random.choice(log_actions),
                user=f'user{random.randint(1, 50)}',
                tenant=random.choice(tenants) if random.choice([True, False]) else None,
                ip_address=f'192.168.1.{random.randint(1, 255)}',
                created_at=timezone.now() - timedelta(hours=random.randint(1, 168))
            )

        # Create system health records
        services = ['Database', 'API Server', 'File Storage', 'Email Service', 'Analytics Engine']
        for service in services:
            SystemHealth.objects.get_or_create(
                service_name=service,
                defaults={
                    'status': random.choice(['healthy', 'degraded']),
                    'response_time': random.uniform(50, 500),
                    'uptime_percentage': random.uniform(95, 100),
                    'last_check': timezone.now()
                }
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully created SuperAdmin sample data!')
        )
