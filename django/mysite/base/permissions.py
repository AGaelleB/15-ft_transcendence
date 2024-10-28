from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import RefreshToken

"""
because we cant blacklist access token, we need to ensure user.is_connected for routes that only ask auth
"""

class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class IsOwnerPermission(BasePermission):
    """
    Custom permission users to only access their own info, (pathes with <str:username>)
    """
    def has_permission(self, request, view):
        if request.user.username == view.kwargs.get('username'):
            return True
        return False
    
class IsUserConnectedPermission(BasePermission):
    """
    on logout we can only turn user disconnected and blacklist refresh token. So acces token can still be used
    to mitigate (even if short lifetime), we add is_connected check to routes that would only required auth!
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.is_connected:
            return True
        return False
    
class UserListCreatePermission(BasePermission):
    """
    create user: superuser only; list all users: any authenticated user
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'OPTIONS', 'HEAD']:
            return request.user.is_authenticated and request.user.is_connected
        if request.method in ['POST']:
            return request.user.is_authenticated and request.user.is_superuser
        return False

class UserRUDPermission(BasePermission):
    """
    PUT/DELETE: auth user must be owner. Others methods: only auth
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'OPTIONS', 'HEAD']:
            return request.user.is_authenticated and request.user.is_connected
        if request.method in ['PUT', 'DELETE']:
            return request.user.is_authenticated and request.user.is_connected and request.user.username == view.kwargs.get('username')
        return False
    
class UserLogoutPermission(BasePermission):
    """
    auth user must be owner of the refresh (request.user.id is actually obtained from acces token)
    permissions are checked before seria: missing refresh return True to let seria raise its own error
    """
    def has_permission(self, request, view):
        if request.method == 'POST':
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return True
            try:
                refresh = RefreshToken(refresh_token)
                user_id = refresh.payload.get('user_id')
                return request.user.id == user_id and request.user.is_connected
            except Exception:
                return False