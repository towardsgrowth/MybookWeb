from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import Book, Author, Category, Comment
from django.shortcuts import render, get_object_or_404, redirect
from .forms import CommentForm
from django.contrib.auth.decorators import login_required
# ---------------------------------Basic views---------------------------------------------------------------------------
def index(request):
    books = Book.objects.all()
    return render(request, 'app/index.html', context={"books":books})

def categories(request):
    categories = Category.objects.all()
    return render(request, 'app/categories.html', context={"categories":categories})
# ------------------------------------------------Register-------------------------------------------------------------------------
def register_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        if password != password2:
            messages.error(request, "Parollar mos kelmadi!")
            return redirect('register')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Bu foydalanuvchi nomi allaqachon mavjud!")
            return redirect('register')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Bu email allaqachon ishlatilgan!")
            return redirect('register')

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        messages.success(request, "Registratsiya muvaffaqiyatli amalga oshirildi!")
        return redirect('login')

    return render(request, 'app/register.html')

# ----------------------------------------------Login/logout---------------------------------------------------------------------------
def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        try:
            username = User.objects.get(email=email).username
        except User.DoesNotExist:
            messages.error(request, "Email yoki parol noto'g'ri!")
            return redirect('login')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, "Login muvaffaqiyatli amalga oshirildi!")
            return redirect('profile')
        else:
            messages.error(request, "Email yoki parol noto'g'ri!")
            return redirect('login')

    return render(request, 'app/login.html')


def logout_view(request):
    logout(request)
    messages.success(request, "Siz logout qilindingiz!")
    return redirect('index')
# ------------------------------------------------------------Categories/books------------------------------------------------------

def category_books(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    books = Book.objects.filter(category=category)
    return render(request, 'app/category_books.html', {'category': category, 'books': books})

def books_by_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    books = Book.objects.filter(category=category)
    return render(request, 'app/category_books.html', context={"books": books, "category": category})


# ------------------------------------------------Book detail/comment------------------------------------------------------------
def book_detail(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    comments = Comment.objects.filter(book=book).order_by('-created_at')

    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.book = book
            if request.user.is_authenticated:
                comment.user = request.user
            comment.save()
            return redirect('book_detail', book_id=book.id)
    else:
        form = CommentForm()

    context = {
        'book': book,
        'comments': comments,
        'form': form,
    }
    return render(request, 'app/book-detail.html', context)
# ----------------------------------------------------Profile------------------------------------------------------------------
@login_required
def profile_view(request):
    user = request.user

    # Agar foydalanuvchining profili yo‘q bo‘lsa — avtomatik yaratish
    from .models import Profile
    if not hasattr(user, 'profile'):
        Profile.objects.create(user=user)

    if request.method == 'POST':
        full_name = request.POST.get('profile-fullname')
        email = request.POST.get('profile-email-input')
        phone = request.POST.get('profile-phone')
        location = request.POST.get('profile-location')
        bio = request.POST.get('profile-bio')

        user.first_name = full_name
        user.email = email
        user.save()

        profile = user.profile
        profile.phone = phone
        profile.location = location
        profile.bio = bio
        profile.save()

        messages.success(request, "Profil muvaffaqiyatli yangilandi!")
        return redirect('profile')

    return render(request, 'app/profile.html', {'user': user})


@login_required
def change_password(request):
    if request.method == 'POST':
        current_password = request.POST.get('current-password')
        new_password = request.POST.get('new-password')
        confirm_password = request.POST.get('confirm-new-password')

        user = request.user

        if user.check_password(current_password):
            if new_password == confirm_password:
                user.set_password(new_password)
                user.save()
                messages.success(request, "Parol muvaffaqiyatli yangilandi!")
                return redirect('login')
            else:
                messages.error(request, "Yangi parollar mos kelmadi!")
        else:
            messages.error(request, "Joriy parol noto‘g‘ri!")

    return redirect('profile')