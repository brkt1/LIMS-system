from django.db import models
from lab.models import LabBaseModel

class FAQCategory(LabBaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        app_label = 'lab'
        verbose_name_plural = 'FAQ Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class FAQ(LabBaseModel):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.ForeignKey(FAQCategory, on_delete=models.CASCADE, related_name='faqs')
    is_published = models.BooleanField(default=True)
    view_count = models.PositiveIntegerField(default=0)
    helpful_count = models.PositiveIntegerField(default=0)
    not_helpful_count = models.PositiveIntegerField(default=0)
    related_faqs = models.ManyToManyField('self', blank=True, symmetrical=False)
    
    class Meta:
        app_label = 'lab'
        ordering = ['question']
    
    def __str__(self):
        return self.question

class FAQFeedback(LabBaseModel):
    faq = models.ForeignKey(FAQ, on_delete=models.CASCADE, related_name='feedback')
    is_helpful = models.BooleanField()
    comment = models.TextField(blank=True, null=True)
    user_ip = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback for FAQ: {self.faq.question[:50]}..."
