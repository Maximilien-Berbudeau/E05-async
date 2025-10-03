# Back

Pour le back, nous allons créer un dossier `back` à la racine de notre projet. Dans ce dossier, nous allons créer un fichier `index.js` avec le contenu suivant :

```javascript
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

Ici nous utilisons Express pour créer un serveur Node.js qui écoute sur le port 3000. Modifions le docker compose pour servir ce fichier :

```yaml
services:
  front:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./front:/usr/share/nginx/html

  back:
    image: node:20-alpine
    volumes:
      - ./back:/app
    working_dir: /app
    command: node index.js
```

L'instruction `command` permet de lancer une commande dans le conteneur. Ici, nous lançons le fichier `index.js` avec Node.js.

Relancez les services :

```bash
docker compose up -d
```

Une erreur survient : 

> back-1   | /app/index.js:1
> 
> back-1   | import express from 'express';

La dépendance `express` n'est pas installée dans le conteneur. Pour installer les dépendances, nous devons créer un fichier `package.json` dans le dossier `back` avec le contenu suivant :

```json
{
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

> Il est aussi possible de l'initialiser avec `npm init -y` depuis le terminal du conteneur `back`.

## Interlude Dockerfile

Les dépendances de notre projet Node doivent être accessibles dans le conteneur. Pour rappel, notre machine hôte n'a pas Node.js ni npm d'installé. Nous devons donc les installer dans le conteneur.

Nous avons besoin de créer une image particulière pour notre projet Node. Nous avons donc besoin d'un Dockerfile !

Le Dockerfile est un fichier qui contient les instructions pour créer une image Docker. Nous allons créer un Dockerfile dans le dossier `back` avec le contenu suivant :

```Dockerfile
# Utilisez une image Node.js comme base
FROM node:20-alpine

# Créez un répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et le package-lock.json dans le conteneur
COPY package.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application dans le conteneur
COPY . .

# Exposez le port sur lequel le service écoutera
EXPOSE 3000
```

Ces instructions seront lancées à chaque fois que l'image sera construite. Pour que compose utilise ce Dockerfile, nous devons le spécifier dans le fichier `docker-compose.yml` :

```yaml
services:
  front:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./front:/usr/share/nginx/html

  back:
    build: ./back
    ports:
      - "3000:3000"
    command: node index.js
```

- `build` : chemin du Dockerfile

Pour le service `back`, il n'y a plus de volume à monter, car les fichiers de l'application sont copiés dans le conteneur lors de la construction de l'image. Dans cette configuration, si nous modifions le fichier `index.js` ou `package.json`, nous devons reconstruire l'image avec la commande suivante :

```bash
docker compose build back
```

ou 

```bash
docker compose up --build
```

D'autres techniques seront vues plus loin ;)

## Back to the back

Relancez les services :

```bash
docker compose up -d
```

Accédez à `http://localhost:3000` pour voir la page d'accueil du back !

---

[:arrow_left:  Précédent](./front.md) | [Suivant :arrow_right:](./db.md)
