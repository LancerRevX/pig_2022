# Generated by Django 4.1.1 on 2022-10-10 12:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bmstu_lab', '0006_patient_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='gender',
            field=models.IntegerField(choices=[(0, 'Женщина'), (1, 'Мужчина')]),
        ),
    ]