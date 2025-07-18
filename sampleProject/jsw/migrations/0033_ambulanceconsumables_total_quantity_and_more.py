# Generated by Django 5.1.4 on 2025-06-26 13:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0032_expiryregister_total_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='ambulanceconsumables',
            name='total_quantity',
            field=models.PositiveBigIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='discardedmedicine',
            name='total_quantity',
            field=models.PositiveBigIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='wardconsumables',
            name='total_quantity',
            field=models.PositiveBigIntegerField(default=0),
            preserve_default=False,
        ),
    ]
