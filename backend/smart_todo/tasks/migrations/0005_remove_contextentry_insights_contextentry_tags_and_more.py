# Generated by Django 5.2.4 on 2025-07-07 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0004_rename_priority_score_task_priority'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contextentry',
            name='insights',
        ),
        migrations.AddField(
            model_name='contextentry',
            name='tags',
            field=models.ManyToManyField(blank=True, to='tasks.tag'),
        ),
        migrations.AlterField(
            model_name='contextentry',
            name='source_type',
            field=models.CharField(choices=[('email', 'Email'), ('whatsapp', 'WhatsApp'), ('note', 'Note'), ('meeting', 'Meeting'), ('document', 'Document'), ('other', 'Other')], max_length=20),
        ),
    ]
