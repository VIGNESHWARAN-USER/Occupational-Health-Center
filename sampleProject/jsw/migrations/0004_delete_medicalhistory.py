# Generated by Django 5.1.4 on 2025-03-31 19:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0003_rename_address_employee_details_permanent_address_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='MedicalHistory',
        ),
    ]
