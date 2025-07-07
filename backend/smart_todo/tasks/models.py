from django.db import models

# --------------------- CATEGORY MODEL ---------------------
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    usage_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

# --------------------- TAG MODEL ---------------------
class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

# --------------------- TASK MODEL ---------------------
class Task(models.Model):
    STATUS_CHOICE = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('in-progress', 'In Progress'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    priority = models.FloatField(default=0)
    deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICE, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Tasks"
        ordering = ['-created_at']

# --------------------- CONTEXT ENTRY MODEL ---------------------
class ContextEntry(models.Model):
    SOURCE_CHOICES = [
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
        ('note', 'Note'),
        ('meeting', 'Meeting'),
        ('document', 'Document'),
        ('other', 'Other'),
    ]

    content = models.TextField()
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return f"{self.source_type} entry at {self.timestamp}"

    class Meta:
        verbose_name_plural = "Context Entries"
        ordering = ['-timestamp']
