# Generated by Django 5.1.4 on 2025-02-10 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0005_delete_otherstest_delete_womenspack'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='status',
            field=models.CharField(choices=[('initiate', 'Initiate'), ('inprogress', 'In Progress'), ('completed', 'Completed')], default='initiate', max_length=20),
        ),
    ]
