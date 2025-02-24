# Generated by Django 5.1.4 on 2025-02-12 14:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0006_appointment_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='FitnessAssessment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tremors', models.CharField(choices=[('Positive', 'Positive'), ('Negative', 'Negative')], max_length=10)),
                ('romberg_test', models.CharField(choices=[('Positive', 'Positive'), ('Negative', 'Negative')], max_length=10)),
                ('acrophobia', models.CharField(choices=[('Positive', 'Positive'), ('Negative', 'Negative')], max_length=10)),
                ('trendelenberg_test', models.CharField(choices=[('Positive', 'Positive'), ('Negative', 'Negative')], max_length=10)),
                ('job_nature', models.TextField()),
                ('overall_fitness', models.TextField()),
                ('comments', models.TextField(blank=True, null=True)),
                ('emp_no', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fitness_assessments', to='jsw.employee_details')),
            ],
        ),
    ]
