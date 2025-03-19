# Generated by Django 5.1.4 on 2025-03-19 05:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0028_alter_appointment_entry_date_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_date', models.DateField(auto_now=True)),
                ('emp_no', models.CharField(blank=True, max_length=20, null=True)),
                ('complaints', models.TextField(blank=True, null=True)),
                ('diagnosis', models.TextField(blank=True, null=True)),
                ('notifiable_remarks', models.TextField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
