from django.urls import path
from . import views

app_name = 'Tech Forums'

urlpatterns = [
    path('api/discussions/', views.discussions), #GET
    path('api/discussions_post/', views.discussions_post), #POST
    path('api/forums/', views.forums), #GET, POST
    path('api/forum/<int:forum_id>', views.forum), #GET, PUT, DELETE
    path('api/forum_discussions/<int:forum_id>', views.forum_discussions), #GET
    path('api/discussion/<int:discussion_id>', views.discussion), #GET, PUT, DELETE
    path('api/discussion_comments/<int:discussion_id>', views.discussion_comments), #GET, POST
    path('api/comment/<int:comment_id>', views.comment), #PUT, DELETE
    path('api/account_details/<int:account_id>', views.account), #GET, PUT, DELETE
    path('api/signup/', views.signup_view), #POST
    path('api/login/', views.login_view), #POST
    path('api/logout/', views.logout_view), #GET
    path('api/user_details/<int:user_id>', views.user_details), #GET
    path('api/user/', views.user_view), #GET
    path('api/get_csrf', views.get_csrf_token) #GET
]