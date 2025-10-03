# Variables d'environnement

Les variables d'environnement sont des valeurs qui peuvent être utilisées par les applications pour modifier leur comportement. Elles sont souvent utilisées pour stocker des informations sensibles comme des mots de passe ou des clés d'API.

Dans un environnement Docker, les variables d'environnement peuvent être définies dans le fichier `compose.yml` pour chaque service. Elles sont ensuite injectées dans les conteneurs au moment du démarrage.

Voici un exemple de définition de variables d'environnement dans un fichier `compose.yml` :

```yaml
services:
  front:
    image: nginx
    environment:
      - ENV_VAR_1=value1
      - ENV_VAR_2=value2
```

Dans cet exemple, deux variables d'environnement `ENV_VAR_1` et `ENV_VAR_2` sont définies pour le service `front`. Ces variables seront injectées dans le conteneur au moment du démarrage et pourront être utilisées par l'application.

Il est également possible de définir des variables d'environnement dans un fichier `.env` à la racine du projet. Ces variables seront automatiquement injectées dans les conteneurs au moment du démarrage.

```environment
ENV_VAR_1=value1
ENV_VAR_2=value2
```

Les variables d'environnement peuvent être ensuite utilisées dans le fichier `compose.yml` en utilisant la syntaxe `${VAR_NAME}` :

```yaml
services:
  front:
    image: nginx
    environment:
      - ENV_VAR_1=${ENV_VAR_1}
      - ENV_VAR_2=${ENV_VAR_2}
```

ou plus simplement en fournissant le fichier `.env` directement :

```yaml
services:
  front:
    image: nginx
    env_file:
      - .env
```

## Cas concret : microservices

Dans une architecture microservices, il est courant d'avoir plusieurs services qui communiquent entre eux via Redis. Afin de simplifier la configuration de ces services, il est possible de définir les variables d'environnement nécessaires dans des fichiers `.env` :

> redis.env

```environment
REDIS_HOST=redis
REDIS_PORT=6379
```

> auth.env

```environment
JWT_SECRET=Ma-Cl3_S*ecr3t!
```

Ces variables peuvent ensuite être injectées dans les conteneurs des services qui en ont besoin :

```yaml
services:
  authentication:
    env_file:
      - redis.env
      - auth.env
    depends_on:
      - api-user
      - api-role
      - redis

  api-user:
    image: node
    env_file:
      - redis.env
    depends_on:
      - redis

  api-role:
    image: node
    env_file:
      - redis.env
    depends_on:
      - redis
  
  redis:
    image: redis:latest
    ports:
      - "${REDIS_PORT}:6379"
```

---

[:arrow_left:  Précédent](./network.md) | [Suivant :arrow_right:](./healthcheck.md) 