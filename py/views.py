from django.shortcuts import render, get_object_or_404, redirect
from django.core.exceptions import ObjectDoesNotExist
from .models import Course, Question, Choice, Submission, Learner

def submit(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    
    if request.method == 'POST':
        # Logic to get the current learner - IMPORTANT: Update this for your project
        try:
            learner = Learner.objects.get(user=request.user)
        except (ObjectDoesNotExist, TypeError):
            # Handle case where user is not a learner (e.g., admin)
            return render(request, 'error.html', {'message': 'Only learners can submit exams.'})

        # 1. Create the Submission object first
        submission = Submission.objects.create(enrollment=learner)
        
        # 2. Gather all selected choices
        selected_choices_ids = []
        for key, value in request.POST.items():
            if key.startswith('question_'):
                selected_choices_ids.append(value)
        
        # 3. Associate selected choices with the submission
        selected_choices = Choice.objects.filter(pk__in=selected_choices_ids)
        submission.choices.set(selected_choices)

        # Now we can grade the submission (similar to before)
        score = 0
        total_score = 0
        
        for question in course.question_set.all():
            total_score += question.grade
            # Get the choice the user selected for THIS question
            selected_choice = selected_choices.filter(question=question).first()
            
            if selected_choice and selected_choice.is_correct:
                    score += question.grade
        
        # Calculate percentage
        percentage = (score / total_score) * 100 if total_score > 0 else 0
        
        # We need to pass the submission_id for the new URL structure
        return redirect('show_exam_result', course_id=course.id, submission_id=submission.id)
        
    return render(request, 'exam_template.html', {'course': course})


def show_exam_result(request, course_id, submission_id):
    course = get_object_or_404(Course, pk=course_id)
    submission = get_object_or_404(Submission, pk=submission_id)
    
    # Grade the specific submission for the result page
    score = 0
    total_score = 0
    for question in course.question_set.all():
        total_score += question.grade
        # Find the choice the learner made for this specific question
        selected_choice = submission.choices.filter(question=question).first()
        if selected_choice and selected_choice.is_correct:
            score += question.grade
            
    percentage = (score / total_score) * 100 if total_score > 0 else 0
    passed = percentage >= 70 
    
    context = {
        'course': course,
        'submission': submission,
        'score': score,
        'percentage': percentage,
        'passed': passed
    }
    return render(request, 'exam_result.html', context)
