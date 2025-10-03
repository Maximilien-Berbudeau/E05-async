# Volumes

Les volumes sont utilisés pour faire persister les données générées et utilisées par les conteneurs. Ils sont gérés par Docker et peuvent être montés dans plusieurs conteneurs.

> Dans le cas d'une base de données, c'est extrêmement pratique.

Dans notre configuration actuelle, nous n'avons pas défini de volume pour le service `db`. Cela signifie que les données de la base de données ne sont pas persistées. Si le conteneur est supprimé, les données sont perdues.

```yaml
db:
  image: postgres:13
  environment:
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
    POSTGRES_DB: mydb
  volumes:
    - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

Pour vérifier, lancez les services, accédez à `adminer` et ajouter un élément dans la table `users`. Ensuite arrêtez les services avec `docker compose down` puis relancez-les. Vous verrez que l'élément ajouté précédemment n'est plus présent.

## Montage de volumes

Pour monter un volume, il suffit de déclarer un volume dans le service et de le monter dans le conteneur.

```yaml
db:
  image: postgres:13
  environment:
  POSTGRES_USER: user
  POSTGRES_PASSWORD: password
  POSTGRES_DB: mydb
  volumes:
    - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    - ./data:/var/lib/postgresql/data
```

Cette instruction `./data:/var/lib/postgresql/data` monte le dossier `./data` du système hôte dans le dossier `/var/lib/postgresql/data` du conteneur. Ainsi, les données de la base de données sont persistées sur le système hôte. Un dossier apparaîtra à la racine du projet nommé `data`.

Une variante de cette instruction est de monter un volume sans le mapper sur l'hôte.

```yaml
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
      - db-data:/var/lib/postgresql/data

  adminer:
    image: adminer
    ports:
      - "8081:8080"

volumes:
  db-data:
```

Dans cet exemple, le volume `db-data` est créé et monté dans le conteneur `db`. Le volume n'est pas mappé sur le système hôte. Les données sont persistées dans un volume Docker.

## Suppression de volumes

Pour supprimer un volume, il suffit de supprimer le volume et de lancer la commande `docker compose down -v`.

En relançant les services, vous verrez que les données de la base de données ont été perdues.

---

[:arrow_left: Précédent](./db.md) | [Suivant :arrow_right:](./network.md)
