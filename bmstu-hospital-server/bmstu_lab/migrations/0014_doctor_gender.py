# Generated by Django 4.1.1 on 2022-10-23 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bmstu_lab', '0013_speciality_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctor',
            name='gender',
            field=models.IntegerField(choices=[(0, 'Женщина'), (1, 'Мужчина')], default=1),
            preserve_default=False,
        ),
    ]
