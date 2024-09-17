# nginx/Dockerfile

FROM nginx:latest

# Copie le fichier de configuration Nginx dans le conteneur
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers frontend (HTML, CSS, JS) dans le répertoire où Nginx les servira
COPY ./frontend/srcs /usr/share/nginx/html

EXPOSE 80