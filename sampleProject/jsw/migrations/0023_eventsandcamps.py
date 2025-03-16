# Generated by Django 5.1.4 on 2025-03-15 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0022_delete_eventsandcamps'),
    ]

    operations = [
        migrations.CreateModel(
            name='eventsandcamps',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('camp_name', models.TextField(max_length=100)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('camp_details', models.TextField(max_length=225)),
                ('camp_type', models.TextField(default='Upcoming', max_length=100)),
                ('report1', models.FileField(blank=True, null=True, upload_to='camp_reports/')),
                ('report2', models.FileField(blank=True, null=True, upload_to='camp_reports/')),
                ('photos', models.ImageField(blank=True, null=True, upload_to='camp_photos/')),
                ('ppt', models.FileField(blank=True, null=True, upload_to='camp_presentations/')),
            ],
        ),
    ]
