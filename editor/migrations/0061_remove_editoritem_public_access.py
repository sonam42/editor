# Generated by Django 3.2.5 on 2021-11-22 10:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('editor', '0060_auto_20211122_0957'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='editoritem',
            name='public_access',
        ),
    ]
