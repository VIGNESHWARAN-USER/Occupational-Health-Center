# Generated by Django 5.1.4 on 2025-04-05 04:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0019_remove_member_contact_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee_details',
            name='employee_status',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='employee_details',
            name='since_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
