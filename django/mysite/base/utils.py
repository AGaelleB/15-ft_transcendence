import mimetypes
from django.conf import settings

def rename_image(instance, filename):
    ext = filename.split('.')[-1]
    return f"images/{instance.username}.{ext}"
    
def get_image_mime_type(image):
    mime_type, _ = mimetypes.guess_type(image.url)
    if mime_type is None:
        return 'application/octet-stream'
    return mime_type


def custom_set_token(response, key, token, samesite="Lax"):
    secure = not settings.DEBUG 
    response.set_cookie(
        key,
        token.encoding,
        httponly=True,
        samesite=samesite,
        secure=secure,
    )
