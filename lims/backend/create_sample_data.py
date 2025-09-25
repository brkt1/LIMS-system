#!/usr/bin/env python
"""
Script to create sample data for the LIMS system
Run this with: python manage.py shell < create_sample_data.py
"""

import os
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lab.components.Technician.Equipment.equipment_models import Equipment, EquipmentCalibration
from lab.components.Doctor.NewTestRequest.NewTestRequest_models import TestRequest
from lab.components.Inventory.inventory_models import InventoryCategory, Supplier, InventoryItem
from lab.components.Analytics.analytics_models import LabAnalytics
from django.contrib.auth import get_user_model

User = get_user_model()

def create_sample_data():
    """Create sample data for development and testing"""
    
    print("Creating sample data...")
    
    # 1. Create Equipment
    equipment_data = [
        {
            'name': 'Microscope Olympus CX23',
            'model': 'CX23',
            'serial_number': 'MIC001',
            'department': 'Microbiology',
            'status': 'operational',
            'priority': 'high',
            'location': 'Lab Room 1',
            'supplier': 'Olympus Corporation',
            'notes': 'Primary microscope for routine examinations',
            'tenant': 'Demo Lab'
        },
        {
            'name': 'Centrifuge Eppendorf 5424',
            'model': '5424',
            'serial_number': 'CEN001',
            'department': 'Hematology',
            'status': 'operational',
            'priority': 'medium',
            'location': 'Lab Room 2',
            'supplier': 'Eppendorf',
            'notes': 'High-speed centrifuge for blood samples',
            'tenant': 'Demo Lab'
        },
        {
            'name': 'Automated Analyzer Abbott Architect',
            'model': 'Architect c8000',
            'serial_number': 'ANA001',
            'department': 'Chemistry',
            'status': 'maintenance',
            'priority': 'high',
            'location': 'Lab Room 3',
            'supplier': 'Abbott Laboratories',
            'notes': 'Scheduled maintenance due',
            'tenant': 'Demo Lab'
        },
        {
            'name': 'PCR Machine Applied Biosystems',
            'model': '7500 Fast',
            'serial_number': 'PCR001',
            'department': 'Molecular Biology',
            'status': 'operational',
            'priority': 'high',
            'location': 'Lab Room 4',
            'supplier': 'Applied Biosystems',
            'notes': 'Real-time PCR system',
            'tenant': 'Demo Lab'
        },
        {
            'name': 'Incubator Thermo Scientific',
            'model': 'Heratherm IGS60',
            'serial_number': 'INC001',
            'department': 'Microbiology',
            'status': 'operational',
            'priority': 'medium',
            'location': 'Lab Room 1',
            'supplier': 'Thermo Fisher Scientific',
            'notes': 'CO2 incubator for cell culture',
            'tenant': 'Demo Lab'
        }
    ]
    
    for eq_data in equipment_data:
        equipment, created = Equipment.objects.get_or_create(
            serial_number=eq_data['serial_number'],
            defaults=eq_data
        )
        if created:
            print(f"Created equipment: {equipment.name}")
        else:
            print(f"Equipment already exists: {equipment.name}")
    
    # 2. Create Test Requests
    test_requests_data = [
        {
            'patient_name': 'John Smith',
            'patient_id': 'P001',
            'test_type': 'Complete Blood Count',
            'priority': 'Normal',
            'date_requested': timezone.now().date(),
            'notes': 'Routine checkup'
        },
        {
            'patient_name': 'Sarah Johnson',
            'patient_id': 'P002',
            'test_type': 'Blood Glucose',
            'priority': 'Urgent',
            'date_requested': timezone.now().date(),
            'notes': 'Diabetes monitoring'
        },
        {
            'patient_name': 'Mike Davis',
            'patient_id': 'P003',
            'test_type': 'Urine Analysis',
            'priority': 'Normal',
            'date_requested': (timezone.now() - timedelta(days=1)).date(),
            'notes': 'Annual physical'
        },
        {
            'patient_name': 'Lisa Wilson',
            'patient_id': 'P004',
            'test_type': 'Lipid Profile',
            'priority': 'Normal',
            'date_requested': timezone.now().date(),
            'notes': 'Cardiovascular risk assessment'
        },
        {
            'patient_name': 'Robert Brown',
            'patient_id': 'P005',
            'test_type': 'COVID-19 PCR',
            'priority': 'Critical',
            'date_requested': timezone.now().date(),
            'notes': 'Travel requirement'
        }
    ]
    
    for tr_data in test_requests_data:
        test_request, created = TestRequest.objects.get_or_create(
            patient_id=tr_data['patient_id'],
            test_type=tr_data['test_type'],
            date_requested=tr_data['date_requested'],
            defaults=tr_data
        )
        if created:
            print(f"Created test request: {test_request.patient_name} - {test_request.test_type}")
        else:
            print(f"Test request already exists: {test_request.patient_name} - {test_request.test_type}")
    
    # 3. Create Inventory Categories
    categories_data = [
        {'name': 'Reagents', 'description': 'Laboratory reagents and chemicals'},
        {'name': 'Consumables', 'description': 'Disposable lab supplies'},
        {'name': 'Equipment Parts', 'description': 'Spare parts for equipment'},
        {'name': 'Safety Equipment', 'description': 'Personal protective equipment'},
    ]
    
    for cat_data in categories_data:
        category, created = InventoryCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"Created category: {category.name}")
    
    # 4. Create Suppliers
    suppliers_data = [
        {'name': 'Thermo Fisher Scientific', 'email': 'sales@thermofisher.com', 'phone': '+1-800-874-3723'},
        {'name': 'Sigma-Aldrich', 'email': 'orders@sial.com', 'phone': '+1-800-325-3010'},
        {'name': 'VWR International', 'email': 'info@vwr.com', 'phone': '+1-800-932-5000'},
        {'name': 'Fisher Scientific', 'email': 'customer.service@fishersci.com', 'phone': '+1-800-766-7000'},
    ]
    
    for sup_data in suppliers_data:
        supplier, created = Supplier.objects.get_or_create(
            name=sup_data['name'],
            defaults=sup_data
        )
        if created:
            print(f"Created supplier: {supplier.name}")
    
    # 5. Create Inventory Items
    inventory_items_data = [
        {
            'name': 'Pipette Tips 200μL',
            'description': 'Sterile pipette tips for 200μL pipettes',
            'category': InventoryCategory.objects.get(name='Consumables'),
            'supplier': Supplier.objects.get(name='Thermo Fisher Scientific'),
            'quantity': 50,
            'threshold': 10,
            'unit_price': 25.99,
            'status': 'in-stock',
            'approval_status': 'approved',
            'tenant': 'Demo Lab'
        },
        {
            'name': 'PBS Buffer',
            'description': 'Phosphate Buffered Saline solution',
            'category': InventoryCategory.objects.get(name='Reagents'),
            'supplier': Supplier.objects.get(name='Sigma-Aldrich'),
            'quantity': 12,
            'threshold': 5,
            'unit_price': 45.50,
            'status': 'in-stock',
            'approval_status': 'approved',
            'tenant': 'Demo Lab'
        },
        {
            'name': 'Microscope Bulb',
            'description': 'Halogen bulb for Olympus microscopes',
            'category': InventoryCategory.objects.get(name='Equipment Parts'),
            'supplier': Supplier.objects.get(name='VWR International'),
            'quantity': 3,
            'threshold': 2,
            'unit_price': 89.99,
            'status': 'low-stock',
            'approval_status': 'approved',
            'tenant': 'Demo Lab'
        },
        {
            'name': 'Nitrile Gloves',
            'description': 'Powder-free nitrile examination gloves',
            'category': InventoryCategory.objects.get(name='Safety Equipment'),
            'supplier': Supplier.objects.get(name='Fisher Scientific'),
            'quantity': 25,
            'threshold': 10,
            'unit_price': 12.99,
            'status': 'in-stock',
            'approval_status': 'approved',
            'tenant': 'Demo Lab'
        }
    ]
    
    for inv_data in inventory_items_data:
        inventory_item, created = InventoryItem.objects.get_or_create(
            name=inv_data['name'],
            defaults=inv_data
        )
        if created:
            print(f"Created inventory item: {inventory_item.name}")
    
    # 6. Create Analytics Data
    analytics_data = {
        'tenant': 'Demo Lab',
        'date': timezone.now().date(),
        'total_tests': 25,
        'completed_tests': 20,
        'pending_tests': 3,
        'failed_tests': 2,
        'success_rate': 80.0,
        'equipment_operational': 4,
        'equipment_maintenance': 1,
        'equipment_out_of_service': 0
    }
    
    analytics, created = LabAnalytics.objects.get_or_create(
        tenant=analytics_data['tenant'],
        date=analytics_data['date'],
        defaults=analytics_data
    )
    if created:
        print(f"Created analytics data for {analytics.tenant}")
    
    print("\n=== SAMPLE DATA CREATION COMPLETE ===")
    print(f"Equipment: {Equipment.objects.count()}")
    print(f"Test Requests: {TestRequest.objects.count()}")
    print(f"Inventory Categories: {InventoryCategory.objects.count()}")
    print(f"Suppliers: {Supplier.objects.count()}")
    print(f"Inventory Items: {InventoryItem.objects.count()}")
    print(f"Analytics Records: {LabAnalytics.objects.count()}")

if __name__ == "__main__":
    create_sample_data()
