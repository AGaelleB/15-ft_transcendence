# Generated by Django 5.1.2 on 2024-10-18 11:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_user_username_friend_invite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friend_invite',
            name='receiver',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to='base.user'),
        ),
        migrations.AlterField(
            model_name='friend_invite',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to='base.user'),
        ),
    ]