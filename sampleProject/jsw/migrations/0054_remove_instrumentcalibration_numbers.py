# Generated by Django 5.1.4 on 2025-07-22 03:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0053_instrumentcalibration_instrument_cnodition'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='instrumentcalibration',
            name='numbers',
        ),
    ]
