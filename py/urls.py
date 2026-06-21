from django.urls import path
from . import views

urlpatterns = [
    # Updated paths to match the required structure
    path('<int:course_id>/submit/', views.submit, name='submit'),
    path('course/<int:course_id>/submission/<int:submission_id>/result/', views.show_exam_result, name='show_exam_result'),
]
