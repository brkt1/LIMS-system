from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from lab.models import Sample
from lab.components.Doctor.NewTestRequest.NewTestRequest_models import TestRequest
from .sample_serializers import SampleSerializer, TestRequestSerializer

class SampleList(generics.ListCreateAPIView):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer

    def perform_create(self, serializer):
        # Generate a unique sample ID if not provided
        if not serializer.validated_data.get('id'):
            sample_id = f"SMP{Sample.objects.count() + 1:04d}"
            serializer.save(id=sample_id)
        else:
            serializer.save()

class SampleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer

class SampleUpdateStatus(APIView):
    def post(self, request, pk):
        """Update sample status"""
        try:
            sample = Sample.objects.get(id=pk)
            new_status = request.data.get('status')
            processing_notes = request.data.get('processing_notes')
            
            if new_status:
                sample.status = new_status
            if processing_notes:
                sample.processing_notes = processing_notes
                
            sample.save()
            return Response({"message": "Sample status updated successfully"})
        except Sample.DoesNotExist:
            return Response({"error": "Sample not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PendingTestRequestsList(APIView):
    def get(self, request):
        """Get all pending test requests that haven't been accepted yet"""
        try:
            pending_requests = TestRequest.objects.filter(accepted=False)
            serializer = TestRequestSerializer(pending_requests, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
