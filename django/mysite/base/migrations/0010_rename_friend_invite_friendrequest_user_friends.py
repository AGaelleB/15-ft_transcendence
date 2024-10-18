# Generated by Django 5.1.2 on 2024-10-18 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_alter_user_is_connected'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Friend_invite',
            new_name='FriendRequest',
        ),
        migrations.AddField(
            model_name='user',
            name='friends',
            field=models.ManyToManyField(blank=True, to='base.user'),
        ),
    ]
