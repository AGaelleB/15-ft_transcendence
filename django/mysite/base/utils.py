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

def generate_otp():
    otp = random.randint(100000, 999999) 
    expiration_time = timedelta(minutes=5)
    cache.set("otp", otp, timeout=expiration_time.total_seconds())
    return otp

def send_otp_email(user_email, otp):
    subject = "Votre OTP pour la connexion"
    message = f"Voici votre code de vérification : {otp}. Ce code est valide pendant 5 minutes."
    sender_email = "ft.transcendence.mbbag@gmail.com"
    send_mail(subject, message, sender_email, [user_email])

def custom_set_token(response, key, token, samesite="Lax"):
    secure = not settings.DEBUG 
    response.set_cookie(
        key,
        token.encoding,
        httponly=True,
        samesite=samesite,
        secure=secure,
    )
