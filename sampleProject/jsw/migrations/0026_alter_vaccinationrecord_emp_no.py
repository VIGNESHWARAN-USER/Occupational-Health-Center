# Generated by Django 5.1.4 on 2025-03-16 06:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0025_vaccinationrecord'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vaccinationrecord',
            name='emp_no',
            field=models.CharField(max_length=30),
        ),
    ]
