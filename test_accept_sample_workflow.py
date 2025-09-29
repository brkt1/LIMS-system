#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script to verify the accept sample workflow functionality.
This script creates test data and tests the API endpoints.
"""

import os
import sys
import django
import requests
import json

# Add the backend directory to the Python path
sys.path.append('/Users/maraki/Desktop/lab-form/LIMS-system/lims/backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lab.components.Technician.Sample.sample_model import TestRequest, Sample

def create_test_data():
    """Create test data for the accept sample workflow"""
    print("Creating test data...")
    
    # Create test requests
    test_requests = [
        {
            'patient_name': 'John Doe',
            'test_type': 'Blood Test',
            'priority': 'Normal',
            'notes': 'Routine blood work',
            'accepted': False
        },
        {
            'patient_name': 'Jane Smith',
            'test_type': 'Urine Analysis',
            'priority': 'Urgent',
            'notes': 'Urgent urine analysis',
            'accepted': False
        },
        {
            'patient_name': 'Bob Johnson',
            'test_type': 'X-Ray',
            'priority': 'Critical',
            'notes': 'Critical X-Ray needed',
            'accepted': False
        }
    ]
    
    created_requests = []
    for req_data in test_requests:
        test_request, created = TestRequest.objects.get_or_create(
            patient_name=req_data['patient_name'],
            test_type=req_data['test_type'],
            defaults=req_data
        )
        if created:
            print("Created test request: {}".format(test_request))
            created_requests.append(test_request)
        else:
            print("Test request already exists: {}".format(test_request))
            created_requests.append(test_request)
    
    return created_requests

def test_api_endpoints():
    """Test the API endpoints"""
    base_url = "http://localhost:8000"
    
    print("\nTesting API endpoints...")
    
    # Test getting pending test requests
    try:
        response = requests.get("{}/api/samples/pending-test-requests/".format(base_url))
        if response.status_code == 200:
            data = response.json()
            print("✓ Pending test requests endpoint working. Found {} requests.".format(len(data)))
            for req in data:
                print("  - {}: {} ({})".format(req['patient_name'], req['test_type'], req['priority']))
        else:
            print("✗ Pending test requests endpoint failed: {}".format(response.status_code))
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to server. Make sure the Django server is running.")
        return False
    
    # Test getting samples
    try:
        response = requests.get("{}/api/samples/".format(base_url))
        if response.status_code == 200:
            data = response.json()
            print("✓ Samples endpoint working. Found {} samples.".format(len(data)))
        else:
            print("✗ Samples endpoint failed: {}".format(response.status_code))
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to server. Make sure the Django server is running.")
        return False
    
    return True

def test_accept_workflow():
    """Test the accept workflow by accepting a test request"""
    base_url = "http://localhost:8000"
    
    print("\nTesting accept workflow...")
    
    # Get pending test requests
    try:
        response = requests.get("{}/api/samples/pending-test-requests/".format(base_url))
        if response.status_code == 200:
            pending_requests = response.json()
            if pending_requests:
                # Accept the first test request
                test_request = pending_requests[0]
                accept_response = requests.post("{}/api/accept/{}/".format(base_url, test_request['id']))
                
                if accept_response.status_code == 201:
                    print("✓ Successfully accepted test request {}".format(test_request['id']))
                    print("  Created sample: {}".format(accept_response.json()))
                    
                    # Verify the test request is now marked as accepted
                    updated_response = requests.get("{}/api/samples/pending-test-requests/".format(base_url))
                    if updated_response.status_code == 200:
                        updated_requests = updated_response.json()
                        remaining_ids = [req['id'] for req in updated_requests]
                        if test_request['id'] not in remaining_ids:
                            print("✓ Test request successfully removed from pending list")
                        else:
                            print("✗ Test request still appears in pending list")
                else:
                    print("✗ Failed to accept test request: {}".format(accept_response.status_code))
                    print("  Error: {}".format(accept_response.text))
            else:
                print("No pending test requests found to test with")
        else:
            print("✗ Could not get pending test requests: {}".format(response.status_code))
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to server. Make sure the Django server is running.")
        return False
    
    return True

def main():
    """Main test function"""
    print("=== Accept Sample Workflow Test ===")
    
    # Create test data
    test_requests = create_test_data()
    
    # Test API endpoints
    if test_api_endpoints():
        # Test the accept workflow
        test_accept_workflow()
    
    print("\n=== Test Complete ===")
    print("To test the frontend:")
    print("1. Start the Django server: python manage.py runserver")
    print("2. Start the frontend: npm run dev")
    print("3. Navigate to the technician dashboard and go to Accept Samples page")
    print("4. You should see the test requests with Accept buttons")

if __name__ == "__main__":
    main()
