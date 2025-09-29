from rest_framework import generics, status
from rest_framework.response import Response
from lab.models import TestReport
from .test_reports_serializers import TestReportSerializer

class TestReportList(generics.ListCreateAPIView):
    queryset = TestReport.objects.all()
    serializer_class = TestReportSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Handle standalone test report creation
        if not data.get('test_request'):
            # Validate required fields for standalone reports
            required_fields = ['test_name', 'patient_name', 'patient_id']
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {"error": f"Field '{field}' is required for standalone test reports"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Set default values
            data.setdefault('status', 'Pending')
            data.setdefault('priority', 'Routine')
            # Use a valid category choice instead of 'General'
            if not data.get('category') or data.get('category') not in ['Hematology', 'Biochemistry', 'Immunology', 'Microbiology', 'Radiology', 'Pathology']:
                data['category'] = 'Hematology'  # Default to a valid choice
        
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TestReportDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TestReport.objects.all()
    serializer_class = TestReportSerializer
