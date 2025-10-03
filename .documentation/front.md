# Plusieurs services

Imaginons que nous avons un front en Vanilla JS, un back en Node.js et une base de données Pgsql.

- Le front sera servi par le serveur Nginx
- Le back sera servi par le serveur Node.js
- La base de données sera fournie par le serveur Pgsql

## Front

Pour le front, nous allons créer un dossier `front` à la racine de notre projet. Dans ce dossier, nous allons créer un fichier `index.html` avec le contenu suivant :

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Front</title>
  </head>
  <body>
    <h1>Front</h1>
  </body>
</html>
```

Modifions le docker compose pour servir ce fichier :

```yaml
services:
  front:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./front:/usr/share/nginx/html
```

L'instruction `volumes` permet de monter un volume entre le dossier `front` de notre machine hôte et le dossier `/usr/share/nginx/html` du conteneur Nginx. Si on modifie le fichier `index.html` sur notre machine hôte, les modifications seront automatiquement prises en compte dans le conteneur (et inversement).

Relancez le service :

```bash
docker compose up -d
```

Accédez à `http://localhost:8080` pour voir la page d'accueil du front !

Essayez de modifier le contenu du `<h1>`, et rafraîchissez la page du navigateur, la modification devrait apparaître directement !

---

[:arrow_left: Précédent](./compose.md) | [Suivant :arrow_right:](./back.md)
