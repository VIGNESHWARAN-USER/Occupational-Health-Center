# Generated by Django 5.1.4 on 2025-06-28 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0033_ambulanceconsumables_total_quantity_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='autoimmunetest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='coagulationtest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='ctreport',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='culturesensitivitytest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='enzymescardiacprofile',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='heamatalogy',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='lipidprofile',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='liverfunctiontest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='menspack',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='motiontest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='mrireport',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='occupationalprofile',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='ophthalmicreport',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='otherstest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='renalfunctiontest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='routinesugartests',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='serologytest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='thyroidfunctiontest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='urineroutinetest',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='usgreport',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='womenspack',
            name='checked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='xray',
            name='checked',
            field=models.BooleanField(default=False),
        ),
    ]
