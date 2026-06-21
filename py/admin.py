from django.contrib import admin
# Importing all seven required classes
from .models import Course, Lesson, Instructor, Learner, Question, Choice, Submission

# Define Inlines first
class ChoiceInline(admin.StackedInline):
    model = Choice
    extra = 3

class QuestionInline(admin.StackedInline):
    model = Question
    extra = 3

# Define Admin classes
class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]
    list_display = ['question_text']

class LessonAdmin(admin.ModelAdmin):
    list_display = ['title']

class CourseAdmin(admin.ModelAdmin): # Added this class
    inlines = [QuestionInline]
    list_display = ['name']

# Register all models here
admin.site.register(Course, CourseAdmin)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice)
admin.site.register(Submission)
admin.site.register(Instructor)
admin.site.register(Learner) # Added registration for Learner
