from rest_framework import serializers
from .models import Task, Category, Tag, ContextEntry


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    # Tags accepted as list of strings (write), returned as tag_names (read)
    tags = serializers.ListField(
        child=serializers.CharField(), write_only=True
    )
    tag_names = serializers.SerializerMethodField(read_only=True)

    # Category as name string
    category = serializers.CharField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'tags', 'tag_names',
            'category', 'deadline', 'priority', 'status'
        ]

    def get_tag_names(self, obj):
        return [tag.name for tag in obj.tags.all()]

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        category_name = validated_data.pop('category')
        category, _ = Category.objects.get_or_create(name=category_name.strip())

        task = Task.objects.create(category=category, **validated_data)

        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name.strip())
            task.tags.add(tag)

        return task

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)
        category_name = validated_data.pop('category', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name.strip())
            instance.category = category

        if tags_data is not None:
            instance.tags.clear()
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag_name.strip())
                instance.tags.add(tag)

        instance.save()
        return instance


class ContextEntrySerializer(serializers.ModelSerializer):
    # Accept list of strings on create
    tags = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True,
    )
    
    tag_names = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ContextEntry
        fields = ['id', 'content', 'source_type', 'timestamp', 'tags', 'tag_names']

    def get_tag_names(self, obj):
        return [tag.name for tag in obj.tags.all()]

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        context_entry = ContextEntry.objects.create(**validated_data)

        for tag_name in tags_data:
            tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
            context_entry.tags.add(tag_obj)

        return context_entry
