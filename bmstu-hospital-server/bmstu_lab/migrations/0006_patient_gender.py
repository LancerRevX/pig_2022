# Generated by Django 4.1.1 on 2022-10-10 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bmstu_lab', '0005_patient_birth_date_alter_case_active_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='gender',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
