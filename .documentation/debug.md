# Debugage !

Parfois ~~souvent~~, les choses ne se passent pas comme prévu et on ne comprend plus ce qu'il se passe.

Le premier réflexe est de stopper les services et de les redémarrer pour voir les logs de démarrage.

```bash
docker compose down
docker compose up
```

Si on ne tient pas spécialement aux données, on peut aussi supprimer les volumes puis relancer.

```bash
docker compose down -v
docker compose up
```

Ou en regardant la liste des volumes et en supprimant celui choisi.

```bash
docker volume ls
docker volume rm <volume>
```

## Une histoire de conflit avec d'autres projets ?

Si on a déjà des conteneurs qui tournent et que l'on veut démarrer un autre projet, il est possible que les ports soient déjà utilisés. On peut alors changer les ports dans le fichier `docker-compose.yml` ou arrêter les conteneurs qui utilisent ces ports.

```bash
docker ps
docker stop <conteneur>
```

Pour tous les arrêter sans distinction :

```bash
docker stop $(docker ps -q)
```

Pour rappel, on peut voir la liste de tous nos conteneurs, démarrés ou arrêtés.

```bash
docker ps -a
```

## Une histoire de build ?

Si on a modifié un Dockerfile ou un fichier de configuration, il est possible que l'image ne soit pas reconstruite. Pour forcer la reconstruction de tous les conteneurs, on peut utiliser l'option `--build` sur la commande `up`.

```bash
docker compose up --build
```

Ou d'un seul service :

```bash
docker compose build <service>
docker compose up
```

Si on veut forcer la reconstruction d'un conteneur en particulier (ici front) sans utiliser le cache, on peut utiliser l'option `--no-cache` de la commande `build`.

```bash
docker compose build --no-cache front
docker compose up
```

Dans le doute, on peut également supprimer les conteneurs pour repartir de zéro.

```bash
docker ps -a
docker rm <conteneur>
```

Ou en version bourrin, on supprime tous les conteneurs sans distinction :

```bash
docker rm $(docker ps -a -q)
```

Il est possible de supprimer les images. Leur suppression entraînera leur re-téléchargement. A part libérer de l'espace disque, cela n'a pas d'impact sur les conteneurs.

```bash
docker image ls
docker image rm <image>
```

## Une histoire de réseau ?

Si on a des problèmes de réseau, on peut essayer de supprimer le réseau et de le recréer.

```bash
docker network ls
docker network rm <réseau>
```

Pour supprimer tous les réseaux :

```bash
docker network rm $(docker network ls -q)
```

## Avant d'abandonner Docker 🤯

Si vraiment rien ne fonctionne, on peut essayer de redémarrer Docker.

```bash
sudo service docker restart
```

Ou de faire un `prune` pour nettoyer les conteneurs, images, volumes et réseaux inutilisés.

```bash
docker stop $(docker ps -q)
docker system prune -a -f --volumes
```

[:arrow_left: Précédent](./multi-stage.md) | [Retour à l'accueil :arrow_right:](../README.md)
