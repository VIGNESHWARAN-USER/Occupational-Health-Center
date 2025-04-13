# Generated by Django 5.1.7 on 2025-04-11 05:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0032_alter_consultation_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PharmacyStockHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_date', models.DateField(auto_now=True)),
                ('medicine_form', models.CharField(max_length=20)),
                ('brand_name', models.CharField(max_length=255)),
                ('chemical_name', models.CharField(max_length=255)),
                ('dose_volume', models.CharField(max_length=50)),
                ('total_quantity', models.PositiveIntegerField()),
                ('expiry_date', models.DateField()),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
