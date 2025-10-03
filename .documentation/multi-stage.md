# Multi-stage builds

Le multi-stage build est une fonctionnalité avancée de Docker qui permet de créer des images Docker plus légères et plus modulaires en utilisant plusieurs étapes (stages) dans un seul fichier Dockerfile. Cette technique est particulièrement utile pour compiler des applications, car elle permet de séparer les étapes de construction (build) des étapes d'exécution (runtime).

## Avantages

- **Images plus légères** : Les images Docker générées avec le multi-stage build ne contiennent que les fichiers nécessaires à l'exécution de l'application, ce qui les rend plus légères et plus rapides à télécharger.
- **Modularité** : Les étapes de construction et d'exécution sont séparées, ce qui facilite la maintenance et la mise à jour des images Docker.
- **Sécurité** : Les fichiers de construction (comme les fichiers source et les dépendances de développement) ne sont pas inclus dans l'image finale, ce qui réduit les risques de fuites d'informations sensibles.
- **Performance** : Les étapes de construction peuvent être parallélisées pour accélérer le processus de construction de l'image Docker.
- **Reproductibilité** : Les images Docker générées avec le multi-stage build sont reproductibles, ce qui signifie qu'elles peuvent être construites de la même manière sur différentes machines et environnements.

## Exemple

Voici un exemple de fichier Dockerfile utilisant le multi-stage build pour compiler une application Node.js :

```Dockerfile
# Étape de construction
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape d'exécution
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["node", "dist/index.js"]
```

Dans cet exemple :

- La première étape (`build`) utilise l'image `node:20-alpine` comme base pour installer les dépendances de l'application, copier les fichiers sources, et compiler l'application.
- La deuxième étape utilise à nouveau l'image `node:20-alpine` comme base, mais cette fois-ci elle copie les fichiers compilés de l'étape précédente (`--from=build`) dans l'image finale et définit la commande à exécuter pour démarrer l'application.
- L'image finale ne contient que les fichiers compilés de l'application, ce qui la rend plus légère et plus sécurisée.
- Les étapes de construction et d'exécution sont séparées, ce qui facilite la maintenance et la mise à jour de l'image Docker.
- Les étapes de construction peuvent être exécutées en parallèle, ce qui accélère le processus de construction de l'image Docker.

## Dockerfile dev et prod

Il est possible de créer un Dockerfile pour le développement et un autre pour la production. Le Dockerfile de développement peut inclure des outils de débogage et des dépendances de développement, tandis que le Dockerfile de production peut être optimisé pour la performance et la sécurité.

Grace au multi-stage build, on peut combiner ces deux Dockerfiles en un seul fichier, en utilisant des étapes conditionnelles pour inclure ou exclure certaines instructions en fonction de l'environnement de construction.

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

Ce fichier Dockerfile combine les étapes de développement et de production en utilisant des étapes conditionnelles pour inclure ou exclure certaines instructions en fonction de l'environnement de construction. Cela permet de créer une image Docker qui peut être utilisée à la fois pour le développement et la production, en optimisant les performances et la sécurité pour chaque environnement.

Pour l'utiliser en mode dev, il suffit de préciser l'étape dans le compose :

```yaml
services:
  app:
    build:
      context: ./back
      target: dev
```

Et pour le mode prod, on peut omettre l'étape dans le compose, il ira jusqu'à la dernière étape par défaut :

```yaml
services:
  app:
    build: ./back
```

---

[:arrow_left: Précédent](./healthcheck.md) | [Suivant :arrow_right:](./debug.md)
