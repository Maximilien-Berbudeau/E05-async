# Introduction à Docker

## Qu'est-ce que Docker ?

Docker est un outil qui permet de créer, de déployer et de gérer des applications dans des conteneurs. Les conteneurs permettent de packager une application avec toutes les parties dont elle a besoin, telles que les bibliothèques et autres dépendances, et de la déployer en tant qu'unité unique.

Exemple, je souhaite créer une application web en Php, je vais donc avoir besoin d'un serveur web (Apache) comprenant le langage Php. Avec Docker, je vais pouvoir créer un conteneur qui va contenir mon application web et le serveur web Apache avec Php.

## Installation de Docker sur l'hôte

La seule dépendance de développement à installer sur votre machine hôte est Docker. Nous utiliserons Docker Desktop pour Windows, Mac et Linux.

> https://www.docker.com/products/docker-desktop/

Cet installeur va installer (😯) tout ce dont nous avons besoin (Docker Engine, Docker CLI client, Docker Compose, Docker Content Trust, Kubernetes, et Credential Helper). Voilà, c'est terminé !

## Container vs Image

Une image Docker est un modèle en lecture seule qui contient les instructions pour créer un conteneur Docker. Elle est immuable et peut être partagée via un registre comme Docker Hub.

Un conteneur Docker est une instance en cours d'exécution d'une image. Il est isolé, léger, et peut être lancé, stoppé, déplacé ou supprimé facilement.

## Lancement d'un conteneur

Nous allons lancer un conteneur basé sur une image Node Alpine. C'est à dire que nous aurons à disposition un environnement Linux minimaliste (alpine) avec Node.js installé.

```bash
docker run -it --rm node:20-alpine sh
```

- `docker run` : commande pour lancer un conteneur
- `-it` : pour ouvrir un terminal interactif
- `--rm` : pour supprimer le conteneur après l'arrêt
- `node:20-alpine` : image à utiliser
- `sh` : commande à exécuter dans le conteneur

Cette action télécharge l'image `node:20-alpine` depuis Docker Hub, puis lance un conteneur basé sur cette image. Nous nous retrouvons dans un terminal interactif dans le conteneur.

Nous pouvons dès à présent exécuter des commandes Node.js dans ce conteneur, sans même avoir Node.js installé sur notre machine hôte !

```bash
node -v
```

En fermant le terminal, le conteneur est automatiquement supprimé.

---

[:arrow_left: Retour au sommaire](./) | [Suivant :arrow_right:](./manipulation.md)
