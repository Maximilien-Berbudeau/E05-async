# Docker

## Cours

1. [Introduction](/assets/intro.md)
2. [Manipulation](/assets/manipulation.md)
3. [Docker Compose](/assets/compose.md)
4. Plusieurs services
   - [Front](/assets/front.md)
   - [Back](/assets/back.md)
   - [Base de données](/assets/db.md)
5. [Volume](/assets/volumes.md)
6. [Réseau](/assets/network.md)
7. [Variables d'environnement](/assets/env.md)
8. [Healthcheck](/assets/healthcheck.md)
9. [Dockerfile multi-stage build](/assets/multi-stage.md)
10. [Debugage](/assets/debug.md)

## Atelier

[Création d'une application microservices complexe](/assets/workshop.md)

## Cheat Sheet

### Docker

[Documentation officielle](https://docs.docker.com/)

- `docker run [options] image [command] [args]`: Crée un conteneur à partir d'une image.
- `docker ps`: Liste les conteneurs en cours d'exécution.
- `docker ps -a`: Liste tous les conteneurs.
- `docker ps -q`: Liste les ID des conteneurs.
- `docker ps -aq`: Liste les ID de tous les conteneurs.
- `docker start [container_id]`: Démarre un conteneur arrêté.
- `docker stop [container_id]`: Arrête un conteneur en cours d'exécution.
- `docker rm [container_id]`: Supprime un conteneur arrêté.
- `docker exec -it [container_id] /bin/sh`: Exécute une commande dans un conteneur en cours d'exécution.

> Dockerfile simple

```Dockerfile
# Utilise une image de base
FROM node:20-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie des fichiers de l'hôte dans le conteneur
COPY package.json ./

# Lance une commande au build
RUN npm install

# Expose un port
EXPOSE 3000

# Commande exécutée lors du démarrage du conteneur (si non définie dans le compose file)
CMD node index.js
```

> Dockerfile multi-stage build

```Dockerfile
FROM node:20-alpine AS base

# Étape de téléchargement des dépendances de développement
FROM base AS dev-deps
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i

# Étape de développement
FROM dev-deps AS dev
WORKDIR /usr/src/app
COPY --from=dev-deps /usr/src/app/node_modules /usr/src/app/node_modules
CMD npm run dev

# Étape de construction à partir des dépendances de développement
FROM base AS build
WORKDIR /usr/src/app
COPY --from=dev-deps /usr/src/app/node_modules /usr/src/app/node_modules
ADD . .
RUN npm run build

# Étape de téléchargement des dépendances de production
FROM base as prod-deps
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i --omit dev

# Étape de production
FROM base
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/build build
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY ./package.json ./
EXPOSE 3000
CMD node build
```

### Docker Compose

[Documentation officielle](https://docs.docker.com/compose/)

- `docker compose up`: Démarre les services.
- `docker compose up -d`: Démarre les services en arrière-plan.
- `docker compose down`: Arrête les services.
- `docker compose down -v`: Arrête les services et supprime les volumes.
- `docker compose build`: Construit les images des services.
- `docker compose build --no-cache`: Construit les images des services sans utiliser le cache.

> .env

```env
REDIS_HOST=redis
REDIS_PORT=6379
```

> docker-compose.yml ou compose.yml

```yaml
# Définition des services
services:
  # Nom du service
  front:
    # Image utilisée
    image: nginx
    # Ports exposés
    ports:
      # Port de l'hôte:port du conteneur
      - "8080:80"
    # Volumes partagés
    volumes:
      # Chemin de l'hôte:chemin du conteneur
      - ./front:/usr/share/nginx/html

  back:
    # Chemin du Dockerfile pour construire une image personnalisée
    build: ./back
    ports:
      - "3000:3000"
    # Lance une commande une fois le conteneur démarré
    command: node index.js
    # Variables d'environnement via un fichier
    env_file:
      - .env
    # Dépendances entre les services, le service `db` et `redis` doivent être démarrés avant le service `back`
    depends_on:
      db: # Attend que le service db soit en bonne santé
        condition: service_healthy
      redis: # Attend que le service redis soit démarré
        condition: service_started
    # Définition du réseau pour isoler les services
    networks:
      - db-network

  db:
    image: postgres:13
    # Variables d'environnement
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      # Script d'initialisation de la base de données au lancement de la base de données (si le volume est vide)
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
      # Volume partagé pour persister les données
      - db-data:/var/lib/postgresql/data
    networks:
      - db-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
      start_period: 15s
      interval: 15s
      timeout: 5s
      retries: 5

  redis:
    image: redis:latest
    ports:
      # Utilisation d'un mapping de port avec une variable
      - "${REDIS_PORT}:6379"

# Définition des volumes
volumes:
  db-data:

# Définition des réseaux
networks:
  db-network:
```

### Debug

- `docker compose logs`: Affiche les logs des services.
- `docker compose logs -f`: Affiche les logs en temps réel.
- `docker volume ls`: Liste les volumes.
- `docker volume rm [volume]`: Supprime un volume.
- `docker ps`: Liste les conteneurs en cours d'exécution.
- `docker ps -a`: Liste tous les conteneurs.
- `docker stop [container]`: Arrête un conteneur.
- `docker stop $(docker ps -q)`: Arrête tous les conteneurs.
- `docker compose up --build`: Rebuild les images des services.
- `docker compose build [service]`: Rebuild une image de service.
- `docker compose build --no-cache [service]`: Rebuild une image de service sans utiliser le cache.
- `docker network ls`: Liste les réseaux.
- `docker network inspect [network]`: Affiche les informations d'un réseau.
- `docker network rm <réseau>`: Supprime un réseau.
- `sudo service docker restart`: Redémarre Docker sur Linux.
- `docker system prune -a -f --volumes`: Supprime les conteneurs, images, volumes et réseaux inutilisés.
