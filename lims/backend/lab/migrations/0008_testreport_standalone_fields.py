# Generated manually for TestReport standalone fields

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab', '0007_technician_sample_qualitycontrol_labworkflow_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_name', models.CharField(default='General', max_length=255)),
                ('category', models.CharField(choices=[('Hematology', 'Hematology'), ('Biochemistry', 'Biochemistry'), ('Immunology', 'Immunology'), ('Microbiology', 'Microbiology'), ('Radiology', 'Radiology'), ('Pathology', 'Pathology')], max_length=50)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], default='Pending', max_length=20)),
                ('priority', models.CharField(choices=[('Routine', 'Routine'), ('Urgent', 'Urgent'), ('STAT', 'STAT')], default='Routine', max_length=20)),
                ('result', models.TextField(blank=True, null=True)),
                ('normal_range', models.CharField(blank=True, max_length=100, null=True)),
                ('units', models.CharField(blank=True, max_length=50, null=True)),
                ('technician', models.CharField(blank=True, max_length=255, null=True)),
                ('completed_date', models.DateField(blank=True, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('attachments', models.PositiveIntegerField(default=0)),
                ('patient_name', models.CharField(blank=True, max_length=255, null=True)),
                ('patient_id', models.CharField(blank=True, max_length=50, null=True)),
                ('doctor_name', models.CharField(blank=True, max_length=255, null=True)),
                ('generated_date', models.DateField(auto_now_add=True)),
                ('generated_time', models.TimeField(auto_now_add=True)),
                ('test_request', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='report', to='lab.testrequest')),
            ],
        ),
    ]
