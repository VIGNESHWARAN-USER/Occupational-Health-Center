# Generated by Django 5.1.4 on 2025-03-19 14:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0033_remove_consultation_entry_date_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consultation',
            name='illness_or_injury',
        ),
    ]
