# Generated by Django 5.1.4 on 2025-05-07 05:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0016_fitnessassessment_submitteddoctor'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consultation',
            name='submitted_by_doctor',
        ),
        migrations.RemoveField(
            model_name='consultation',
            name='submitted_by_nurse',
        ),
        migrations.AddField(
            model_name='consultation',
            name='submittedDoctor',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
