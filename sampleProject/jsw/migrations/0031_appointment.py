# Generated by Django 5.1.4 on 2025-03-19 06:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0030_delete_appointment'),
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_date', models.DateField(auto_now=True)),
                ('appointment_no', models.TextField(max_length=255)),
                ('booked_date', models.DateField()),
                ('role', models.TextField(max_length=100)),
                ('name', models.TextField(max_length=100)),
                ('organization_name', models.TextField(max_length=100)),
                ('contractor_name', models.TextField(max_length=100)),
                ('consultated_by', models.TextField(max_length=100)),
                ('employer', models.TextField(max_length=255)),
                ('emp_no', models.TextField(max_length=255)),
                ('aadhar_no', models.TextField(max_length=225)),
                ('doctor_name', models.TextField(max_length=255)),
                ('purpose', models.TextField()),
                ('date', models.DateField()),
                ('time', models.TextField(max_length=225)),
                ('booked_by', models.TextField(max_length=255)),
                ('mrd_no', models.TextField(max_length=255)),
                ('status', models.CharField(choices=[('initiate', 'Initiate'), ('inprogress', 'In Progress'), ('completed', 'Completed'), ('default', 'Default')], default='initiate', max_length=20)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
