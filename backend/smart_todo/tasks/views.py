from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task, Category, ContextEntry, Tag
from .serializers import TaskSerializer, CategorySerializer, ContextEntrySerializer
from .ai_module import enhance_task
from .context_ai import extract_tags
import logging

logger = logging.getLogger(__name__)

# ----------------- TASK VIEWSET -----------------
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Task Validation Error: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def ai_suggestions(self, request):
        task_title = request.data.get("title", "")
        context_data = request.data.get("context", "")

        logger.debug(f"🔍 AI Suggestion Input - Title: {task_title}, Context: {context_data}")

        try:
            ai_response = enhance_task(task_title, context_data)
            logger.debug(f"✅ AI Response: {ai_response}")
            return Response({"suggestions": ai_response}, status=200)
        except Exception as e:
            logger.error(f"❌ AI Error: {str(e)}")
            return Response({"error": str(e)}, status=500)

# ----------------- CATEGORY VIEWSET -----------------
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# ----------------- CONTEXT ENTRY VIEWSET -----------------
class ContextEntryViewSet(viewsets.ModelViewSet):
    queryset = ContextEntry.objects.all().order_by("-timestamp")
    serializer_class = ContextEntrySerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        tags_data = data.pop("tags", [])
        content = data.get("content", "")

        # 🔍 AI Tag Generation
        if not tags_data and content:
            try:
                tags_data = extract_tags(content)
            except Exception as e:
                logger.error("AI tag generation failed: %s", str(e))
                tags_data = []

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            context_entry = serializer.save()
            for tag_name in tags_data:
                tag_obj, _ = Tag.objects.get_or_create(name=tag_name.lower())
                context_entry.tags.add(tag_obj)
            context_entry.save()
            return Response(self.get_serializer(context_entry).data, status=status.HTTP_201_CREATED)

        logger.error("ContextEntry Validation Error: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------- GENERIC LIST+CREATE VIEW -----------------
class ContextEntryListCreateView(generics.ListCreateAPIView):
    queryset = ContextEntry.objects.all().order_by("-timestamp")
    serializer_class = ContextEntrySerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        tags_data = data.pop("tags", [])
        content = data.get("content", "")

        # 🔍 AI Tag Generation
        if not tags_data and content:
            try:
                tags_data = extract_tags(content)
            except Exception as e:
                logger.error("AI tag generation failed: %s", str(e))
                tags_data = []

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            context_entry = serializer.save()
            for tag_name in tags_data:
                tag_obj, _ = Tag.objects.get_or_create(name=tag_name.lower())
                context_entry.tags.add(tag_obj)
            context_entry.save()
            return Response(self.get_serializer(context_entry).data, status=status.HTTP_201_CREATED)

        logger.error("ContextEntryListCreate Validation Error: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
