from django.urls import path
from .views import index, change_password, logout_view, categories, profile_view, login_view, register_view, category_books, book_detail, books_by_category
urlpatterns = [
    path('', index, name='index'),
    path('categories/', categories, name='categories'),
    path('profile/', profile_view, name='profile'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('categories/<int:category_id>/', category_books, name='category_books'),
    path('book/<int:book_id>/', book_detail, name='book_detail'),
    path('category/<int:category_id>/', books_by_category, name='books_by_category'),
    path('logout/', logout_view, name='logout'),
    path('profile/change-password/', change_password, name='change_password'),
]