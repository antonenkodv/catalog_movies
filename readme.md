# Каталог фильмов

---
## Запуск проекта

Используется  Node.js v14+ версии

1. Создать `.env.development` файл и добавить необходимые переменные окружения

2. Cобрать и запустить  из образа
```
docker-compose build
docker-compose up
```
Базовый url :
```http://localhost:8000/api/v1/```

**Для локального запуска**

1. Создать локальную бд 

2. Создать `.env.development` файл и добавить необходимые переменные окружения
```sh
npm install
npm run start
```

## Таблицы

### Users
|ID|Name|Email|Password|
|----|-----|-------|----|
|1|Ivan Ivanov|ivanov@example.com|Hashed Password|

### Actors
|ID|Name|
|---------|---------|
|1|Mel Gibson|

### Movies
|ID|Title|Year|Format|Source|Actors|
|---------|---------|-------|----|------|-----|
|1|Movie title|2020|MVH|http://localhost/api/v1/...|[Actor_id]|

