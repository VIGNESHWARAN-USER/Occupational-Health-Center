# Generated by Django 5.1.4 on 2025-02-28 05:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0003_medicalhistory'),
    ]

    operations = [
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee_number', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('designation', models.CharField(choices=[('Admin', 'Admin'), ('Manager', 'Manager'), ('Staff', 'Staff')], max_length=50)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('role', models.CharField(choices=[('HR', 'HR'), ('IT', 'IT'), ('Finance', 'Finance')], max_length=50)),
                ('date_exited', models.DateField(blank=True, null=True)),
            ],
        ),
    ]
