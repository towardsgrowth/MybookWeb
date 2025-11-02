from django.templatetags.static import static
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

UNFOLD = {
"SITE_TITLE": "Najot Ta'lim",
"SITE_HEADER": "Najot Ta'lim",
"SITE_SUBHEADER": "FN31 | Asrorbek Production",
"SITE_DROPDOWN": [
{
"icon": "diamond",
"title": _("App"),
"link": "[https://example.com](https://example.com)",
},
],
"SIDEBAR": {
"show_search": True,
"command_search": True,
"show_all_applications": True,
"navigation": [
{
"title": _("Navigation"),
"separator": True,
"collapsible": True,
"items": [
{
"title": _("Dashboard"),
"icon": "dashboard",
"link": reverse_lazy("admin:index"),
"permission": lambda request: request.user.is_superuser,
},
{
"title": _("Book"),
"icon": "book",
"link": reverse_lazy("admin:app_book_changelist"),
},
{
"title": _("Author"),
"icon": "article_person",
"link": reverse_lazy("admin:app_author_changelist"),
},
{
"title": _("Category"),
"icon": "category",
"link": reverse_lazy("admin:app_category_changelist"),
},
{
"title": _("Comment"),
"icon": "comment",
"link": reverse_lazy("admin:app_comment_changelist"),
},
],
},
],
},
}
