# Manipulation d'un conteneur

Pour aller plus loin dans la manipulation des conteneurs, nous allons voir comment lister les conteneurs, les arrêter, les supprimer, etc.

## Démarrer un conteneur

```bash
docker run --name monsuperprojet node:20-alpine
```

- `--name monsuperprojet` : nom du conteneur

:warning: Alpine est une distribution minimale, si on ne lui donne pas de commande à exécuter, le conteneur s'arrête immédiatement.

Changeons l'image de notre conteneur pour une image Nginx.

```bash
docker run nginx
```

Le serveur est lancé et attend des connexions sur le port 80. Pour accéder à ce serveur, nous devons exposer le port 80 du conteneur sur un port de notre machine hôte, exemple 8080.

```bash
docker run -p 8080:80 nginx
```

En se rendant sur `http://localhost:8080`, nous devrions voir la page d'accueil de Nginx.

## Lister les conteneurs

Dans un autre terminal, lancer la commande :

```bash
docker ps
```

Nous devrions voir notre conteneur Nginx en cours d'exécution.

```bash
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                                   NAMES
2950a44c199d   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, :::8080->80/tcp   awesome_lehmann
```

- `docker ps` : liste les conteneurs en cours d'exécution
- `docker ps -a` : liste tous les conteneurs
- `docker ps -q` : liste les ID des conteneurs
- `docker ps -aq` : liste les ID de tous les conteneurs

## Stopper, démarrer, supprimer...

- `docker start [container_id]`: Démarre un conteneur arrêté.
- `docker stop [container_id]`: Arrête un conteneur en cours d'exécution.
- `docker rm [container_id]`: Supprime un conteneur arrêté.
- `docker exec -it [container_id] /bin/sh`: Exécute une commande dans un conteneur en cours d'exécution.

:thumbsup: Vous avez maintenant les bases pour manipuler des conteneurs Docker. Mais un peu fastidieux de devoir taper toutes ces commandes à chaque fois, non ? C'est là qu'intervient Docker Compose !

---

[:arrow_left: Précédent](./intro.md) | [Suivant :arrow_right:](./compose.md)
