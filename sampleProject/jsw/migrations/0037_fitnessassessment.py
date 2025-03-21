# Generated by Django 5.1.4 on 2025-03-21 06:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0036_delete_fitnessassessment'),
    ]

    operations = [
        migrations.CreateModel(
            name='FitnessAssessment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_date', models.DateField(auto_now=True)),
                ('emp_no', models.CharField(max_length=20)),
                ('tremors', models.CharField(choices=[('Positive', 'Positive'), ('Negative', 'Negative')], max_length=10)),
                ('romberg_test', models.CharField(choices=[('Positive', 'Positive'), ('Negative', 'Negative')], max_length=10)),
                ('acrophobia', models.CharField(choices=[('Positive', 'Positive'), ('Negative', 'Negative')], max_length=10)),
                ('trendelenberg_test', models.CharField(choices=[('Positive', 'Positive'), ('Negative', 'Negative')], max_length=10)),
                ('conditional_fit_feilds', models.JSONField(blank=True)),
                ('validity', models.DateField(blank=True, null=True)),
                ('job_nature', models.JSONField(blank=True, null=True)),
                ('overall_fitness', models.TextField()),
                ('comments', models.TextField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
