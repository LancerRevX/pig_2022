# Generated by Django 4.1.1 on 2022-11-08 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bmstu_lab', '0017_doctor_cost'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='datetime',
            field=models.DateTimeField(),
        ),
    ]
