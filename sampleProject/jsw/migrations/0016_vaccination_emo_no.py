# Generated by Django 5.1.4 on 2025-03-14 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsw', '0015_medicalhistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='vaccination',
            name='emo_no',
            field=models.CharField(default='Null', max_length=200),
            preserve_default=False,
        ),
    ]
