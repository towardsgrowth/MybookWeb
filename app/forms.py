from django import forms
from .models import Comment,Profile

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
        'content': forms.Textarea(attrs={
        'rows': 3,
        'placeholder': 'Comment yozing...',
        'style': 'width:100%; padding:8px; border-radius:5px; border:1px solid #87ceeb;'})}
        labels = {'content': ''}

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['avatar', 'phone', 'location', 'bio']

