# Healthcheck

Par défaut, l'instruction `depends_on` de Docker Compose attend que le service spécifié (`db`) soit démarré avant de démarrer le service dépendant (`back`).

```yaml
back:
  build: ./back
  ports:
    - "3000:3000"
  command: node index.js
  depends_on:
    - db
```

Le `healthcheck` est une instruction Docker qui permet de définir une commande qui sera exécutée pour vérifier si le conteneur est en bonne santé. Cette instruction est utile pour les applications qui ont besoin de vérifier si un service est prêt à recevoir du trafic.

Par exemple, le `back` a besoin que la base de données soit prête avant de se lancer. Dans le cas où le fichier d'`init.sql` est volumineux, il est possible que le conteneur `db` ne soit pas prêt à temps. Pour éviter cela, il est possible de définir un `healthcheck` pour attendre que la base de données soit prête.

```yaml
back:
  build: ./back
  ports:
    - "3000:3000"
  command: node index.js
  networks:
    - db-network
  depends_on:
    db:
      condition: service_healthy

db:
  image: postgres:13
  environment:
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
    POSTGRES_DB: mydb
  volumes:
    - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    - db-data:/var/lib/postgresql/data
  networks:
    - db-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
    start_period: 15s
    interval: 15s
    timeout: 5s
    retries: 5
```

- `condition: service_healthy` : attend que le service définit soit en bonne santé avant de démarrer le service dépendant.
- `healthcheck` : définit la commande à exécuter pour vérifier si le conteneur est en bonne santé.
  - `test` : commande à exécuter pour vérifier si le conteneur est en bonne santé.
  - `start_period` : délai avant de commencer à vérifier la santé du conteneur.
  - `interval` : intervalle entre chaque vérification.
  - `retries` : nombre de tentatives avant de considérer le conteneur comme non sain.

> Son utilisation est possible également sur des projets de code, comme un projet d'API avec NestJS long à démarrer. On peut établir un `healthcheck` en testant une route de l'API, et lancer le front que quand elle est prête.

```yaml
healthcheck:
  # Fait une requête HTTP sur le port 3000 de lui même
  test: "wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1"
  start_period: 10s # Démarre le healthcheck après 10 secondes
  interval: 5s # Lance le test toutes les 5 secondes
  timeout: 5s # Temps d'attente avant de considérer le test en échec
  retries: 12
```

## Healthy vs Started

`service_healthy` attend que le service soit en bonne santé avant de démarrer le service dépendant. `service_started` attend que le service soit démarré avant de démarrer le service dépendant.

Dans le cas d'une utilisation d'un reverse proxy, certains services n'ont pas de healtcheck configuré et d'autres oui. On peut alors mixer les deux conditions pour attendre que les services soient prêts.

```yaml
reverseproxy:
  image: nginx:latest
  ports:
    - 80:80
  volumes:
    - ./nginx/local.conf:/etc/nginx/nginx.conf
  depends_on:
    back: # Attend que le service backend soit en bonne santé
      condition: service_healthy
    front: # Attend que le service frontend soit démarré
      condition: service_started
```

---

[:arrow_left: Précédent](./env.md) | [Suivant :arrow_right:](./multi-stage.md)
