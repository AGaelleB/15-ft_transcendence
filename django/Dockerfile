# django/Dockerfile

# Utiliser l'image Python slim comme base
FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier requirements.txt dans le conteneur
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install -r requirements.txt

# Copier le code source de l'application dans le conteneur
COPY . .

# Exposer le port 8000 pour le serveur Django
EXPOSE 8000

# django/Dockerfile
ADD wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Démarrer le serveur Django
CMD ["./wait-for-it.sh", "db:5432", "--", "python", "manage.py", "runserver", "0.0.0.0:8000"]