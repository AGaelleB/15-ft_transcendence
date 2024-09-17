FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier le fichier requirements.txt et installer les dépendances Python
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copier tout le code de l'application dans le conteneur
COPY . .

# Exposer le port de l'application
EXPOSE 8000

# Commande pour démarrer avec un wait pour attendre db
CMD ["sh", "-c", "sleep 10 && python manage.py runserver 0.0.0.0:8000"]
