import mimetypes
import random
from datetime import datetime, timedelta
from django.core.cache import cache
from django.core.mail import send_mail


def rename_image(instance, filename):
    ext = filename.split('.')[-1]
    return f"images/{instance.username}.{ext}"
    
def get_image_mime_type(image):
    mime_type, _ = mimetypes.guess_type(image.url)
    if mime_type is None:
        return 'application/octet-stream'
    return mime_type

def generate_otp(user_id):
    otp = random.randint(100000, 999999)  # Générer un OTP à 6 chiffres
    expiration_time = timedelta(minutes=5)  # Durée de validité
    cache.set(f"otp_{user_id}", otp, timeout=expiration_time.total_seconds())
    return otp

def send_otp_email(user_email, otp):
    subject = "Votre OTP pour la connexion"
    message = f"Voici votre code de vérification : {otp}. Ce code est valide pendant 5 minutes."
    sender_email = "noreply@example.com"
    send_mail(subject, message, sender_email, [user_email])