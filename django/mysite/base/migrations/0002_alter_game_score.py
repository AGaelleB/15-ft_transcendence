# Generated by Django 5.1.2 on 2024-10-16 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='score',
            field=models.PositiveIntegerField(),
        ),
    ]
