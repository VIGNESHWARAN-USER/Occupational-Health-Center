# Generated by Django 5.1.4 on 2025-03-12 08:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0007_employee_details_role'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employee_details',
            old_name='identification_marks',
            new_name='identification_marks1',
        ),
        migrations.AddField(
            model_name='employee_details',
            name='identification_marks2',
            field=models.TextField(default='Null', max_length=225),
            preserve_default=False,
        ),
    ]
