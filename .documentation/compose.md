# Docker Compose

Docker Compose est un outil pour définir et gérer des applications multi-conteneurs. Vous utilisez un fichier YAML pour configurer les services de votre application. Ensuite, avec une seule commande, vous créez et démarrez tous les services à partir de votre configuration.

## Commençons avec un seul conteneur

Créez un fichier `compose.yml` ou `docker-compose.yml` à la racine de votre projet avec le contenu suivant :

```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
```

- `services` : liste des services de notre application
- `web` : nom du service
- `image` : image Docker à utiliser
- `ports` : mapping des ports
- `8080:80` : port de notre machine hôte vers le port du conteneur

Lancez la commande suivante pour démarrer le service :

```bash
docker compose up
```

Le service démarre, vous pouvez accéder à `http://localhost:8080` pour voir la page d'accueil de Nginx. Pour arrêter le service, faites `Ctrl + C`.

> L'instruction `docker ps` vous permet de voir les conteneurs créés par Docker Compose.

On peut également lancer le service en arrière-plan avec l'option `-d` :

```bash
docker compose up -d
```

Pour arrêter le service :

```bash
docker compose down
```

---

[:arrow_left: Précédent](./manipulation.md) | [Suivant :arrow_right:](./front.md)
