# Generated by Django 5.1.4 on 2025-03-11 14:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0006_appointment'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee_details',
            name='role',
            field=models.TextField(default='Employee', max_length=50),
            preserve_default=False,
        ),
    ]
