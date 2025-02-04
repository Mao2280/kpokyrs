# Generated by Django 5.1.4 on 2025-01-15 11:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fisrt_name', models.CharField(max_length=64)),
                ('patronymic', models.CharField(max_length=64)),
                ('last_name', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='Child',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fisrt_name', models.CharField(max_length=64)),
                ('patronymic', models.CharField(max_length=64)),
                ('last_name', models.CharField(max_length=64)),
                ('birthday', models.DateField()),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee.employee')),
            ],
        ),
    ]
