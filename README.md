# docker launch

go to frontend/srcs  
`docker build -t nginxapp .`  
`docker run -p 8000:80 nginxapp`  
nginx is running with root dir /www, all front end files put in /www in docker file system  
`docker ps`  
`docker exec -it [dockerid] bash` -> have a bash inside the docker (ls -l /www to see files)

# MODULES

## Web
- [] Major module: Use a Framework as backend.
- [x] Minor module: Use a front-end framework or toolkit.
- [] Minor module: Use a database for the backend -and more.

## User Management
- [] Major module: Standard user management, authentication, users across tournaments


## Gameplay and user experience
- [x] Minor module: Game Customization Options.

## AI-Algo
- [x] Major module: Introduce an AI Opponent
- [] Minor module: User and Game Stats Dashboards.

## Cybersecurity
- [] Major module: Implement Two-Factor Authentication (2FA) and JWT.

## Graphics
- [x] Major module: Implementing Advanced 3D Techniques

## Accessibility
- [] Minor module: Expanding Browser Compatibility.
- [x] Minor module: Multiple language supports.
