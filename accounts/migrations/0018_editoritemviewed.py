# Generated by Django 2.0.13 on 2019-03-20 15:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('editor', '0037_auto_20190320_1436'),
        ('accounts', '0017_auto_20171018_0843'),
    ]

    operations = [
        migrations.CreateModel(
            name='EditorItemViewed',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='views', to='editor.EditorItem')),
                ('userprofile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='last_viewed_items', to='accounts.UserProfile')),
            ],
            options={
                'ordering': ('-date',),
            },
        ),
    ]
