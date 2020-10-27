# Generated by Django 3.1 on 2020-10-27 15:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('editor', '0050_auto_20201019_1127'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='newexam',
            options={'verbose_name': 'exam'},
        ),
        migrations.AlterModelOptions(
            name='newquestion',
            options={'ordering': ['editoritem__name'], 'permissions': (('highlight', 'Can pick questions to feature on the front page.'),), 'verbose_name': 'question'},
        ),
    ]
