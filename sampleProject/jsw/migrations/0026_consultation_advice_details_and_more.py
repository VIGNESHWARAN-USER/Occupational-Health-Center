# Generated by Django 5.1.7 on 2025-04-05 23:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0025_dashboard_mrdno_employee_details_mrdno'),
    ]

    operations = [
        migrations.AddField(
            model_name='consultation',
            name='advice_details',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='consultation',
            name='illness_or_injury',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='emp_no',
            field=models.CharField(blank=True, db_index=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='speaciality',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
