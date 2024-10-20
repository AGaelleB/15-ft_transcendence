import mimetypes

def rename_image(instance, filename):
    ext = filename.split('.')[-1]
    return f"images/{instance.pk}.{ext}"
    
def get_image_mime_type(image):
    mime_type, _ = mimetypes.guess_type(image.url)
    if mime_type is None:
        return 'application/octet-stream'
    return mime_type
