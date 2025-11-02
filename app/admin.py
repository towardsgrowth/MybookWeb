from unfold.admin import ModelAdmin
from django.contrib import admin
from .models import Book, Category, Author, Comment




@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)



@admin.register(Author)
class AuthorAdmin(ModelAdmin):
    list_display = ('name', 'surname', 'age', 'created_at')
    search_fields = ('name', 'surname')
    list_filter = ('age', 'created_at')



@admin.register(Book)
class BookAdmin(ModelAdmin):
    list_display = ('title', 'author', 'category', 'price', 'created_at')
    search_fields = ('title', 'author__name', 'author__surname', 'category__name')
    list_filter = ('category', 'author', 'created_at')
    readonly_fields = ('created_at',)





@admin.register(Comment)
class CommentAdmin(ModelAdmin):
    list_display = ('book', 'user', 'created_at')
    search_fields = ('book__title', 'user__username', 'content')
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)
