from rest_framework.permissions import BasePermission

class IsOwnerPermission(BasePermission):
    """
    Custom permission users to only access their own info.
    """
    def has_permission(self, request, view):
        if request.user.username == view.kwargs.get('username'):
            return True
        return False
    
class UserRUDPermission(BasePermission):
    """
    PUT/DELETE: auth user must be owner. Others methods: only auth
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'OPTION', 'HEAD']:
            return request.user.is_authenticated
        if request.method in ['PUT', 'DELETE']:
            return request.user.is_authenticated and request.user.username == view.kwargs.get('username')
        return False