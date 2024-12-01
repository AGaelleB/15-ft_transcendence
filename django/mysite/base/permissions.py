from rest_framework.permissions import BasePermission

##########################################################
#       Generics Custom Permissions
##########################################################
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
    

##########################################################
#       View specific Custom Permissions
##########################################################
class UserListCreatePermission(BasePermission):
    """
    POST: superuser only (any unauth person??); GET: any authenticated user
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD']:
            return request.user.is_authenticated and request.user.is_connected
        if request.method in ['POST', 'OPTIONS']:
            return True
            #return request.user.is_authenticated and request.user.is_connected #and request.user.is_superuser
            # just check that request.user.is_authenticated == FALSE ?? 
        return False

class UserRUDPermission(BasePermission):
    """
    PUT/DELETE: auth user must be owner. Others methods: any auth user
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'OPTIONS', 'HEAD']:
            return request.user.is_authenticated and request.user.is_connected
        if request.method in ['PUT', 'DELETE']:
            return request.user.is_authenticated and request.user.is_connected and request.user.username == view.kwargs.get('username')
        return False
    

class FriendRequestCreatePermission(BasePermission):
    """
    authenticated user must be the sender
    if missing sender, we let it pass to get the serializer error
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'OPTIONS']:
            return request.user.is_authenticated and request.user.is_connected
        if request.method == 'POST':
            sender = request.data.get('sender')
            if not sender:
                return True
            return str(request.user.id) == sender and request.user.is_connected


class GameListCreatePermission(BasePermission):
    """
    POST: user must be player; GET: any authenticated user
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'OPTIONS', 'HEAD']:
            return request.user.is_authenticated and request.user.is_connected
        if request.method in ['POST']:
            return request.user.is_authenticated and request.user.is_connected #and request.data.get['player'] == request.user
        return False