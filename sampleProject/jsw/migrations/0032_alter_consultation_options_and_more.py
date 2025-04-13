# Generated by Django 5.1.7 on 2025-04-10 06:02

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0031_alter_fitnessassessment_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='consultation',
            options={'ordering': ['-entry_date', '-id']},
        ),
        migrations.RenameField(
            model_name='consultation',
            old_name='advice_details',
            new_name='advice',
        ),
        migrations.RenameField(
            model_name='consultation',
            old_name='speaciality',
            new_name='speciality',
        ),
        migrations.AddField(
            model_name='consultation',
            name='procedure_notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='consultation',
            name='systematic',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='emp_no',
            field=models.CharField(blank=True, db_index=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='entry_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='submitted_by_doctor',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='submitted_by_nurse',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterUniqueTogether(
            name='consultation',
            unique_together={('emp_no', 'entry_date')},
        ),
    ]
