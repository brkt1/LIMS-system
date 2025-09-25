import os
import django
from django.conf import settings
from datetime import date, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lab.components.Doctor.NewTestRequest.NewTestRequest_models import TestRequest

def create_test_request_sample_data():
    print("Creating test request sample data...")

    # Sample test request data
    test_requests_data = [
        {
            "patient_id": "P001",
            "patient_name": "John Smith",
            "test_type": "Blood Panel Complete",
            "priority": "Urgent",
            "notes": "Patient showing signs of fatigue and weakness",
            "date_requested": date.today() - timedelta(days=1),
        },
        {
            "patient_id": "P002",
            "patient_name": "Sarah Johnson",
            "test_type": "X-Ray Chest",
            "priority": "Normal",
            "notes": "Chest pain and shortness of breath",
            "date_requested": date.today() - timedelta(days=2),
        },
        {
            "patient_id": "P003",
            "patient_name": "Mike Davis",
            "test_type": "MRI Brain",
            "priority": "Critical",
            "notes": "Headaches and dizziness",
            "date_requested": date.today() - timedelta(days=3),
        },
        {
            "patient_id": "P004",
            "patient_name": "Lisa Wilson",
            "test_type": "Urine Analysis",
            "priority": "Normal",
            "notes": "Routine checkup",
            "date_requested": date.today() - timedelta(days=4),
        },
        {
            "patient_id": "P005",
            "patient_name": "Robert Brown",
            "test_type": "ECG",
            "priority": "Urgent",
            "notes": "Heart palpitations",
            "date_requested": date.today() - timedelta(days=5),
        },
        {
            "patient_id": "P006",
            "patient_name": "Emily Davis",
            "test_type": "CT Scan Abdomen",
            "priority": "Normal",
            "notes": "Abdominal pain investigation",
            "date_requested": date.today() - timedelta(days=6),
        },
    ]

    for data in test_requests_data:
        try:
            test_request, created = TestRequest.objects.get_or_create(
                patient_id=data["patient_id"],
                patient_name=data["patient_name"],
                test_type=data["test_type"],
                defaults={
                    "priority": data["priority"],
                    "notes": data["notes"],
                    "date_requested": data["date_requested"],
                }
            )
            if created:
                print(f"Created test request: {test_request.patient_name} - {test_request.test_type}")
            else:
                print(f"Test request already exists: {test_request.patient_name} - {test_request.test_type}")
        except Exception as e:
            print(f"Error creating test request {data['patient_name']}: {e}")

    print("\n✅ Test request sample data created successfully!")
    print(f"Total test requests: {TestRequest.objects.count()}")

if __name__ == "__main__":
    create_test_request_sample_data()
