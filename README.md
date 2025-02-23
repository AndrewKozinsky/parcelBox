# Сервер для управления посыльными ящиками

## Запуск
1. Запустите на компьютере Докер.
2. Зайдите в папку проекта.
3. Выполните
```docker compose -f docker-compose.dev.yml up```
для запуска базы данных
4. Перейдите в папку сервера
```cd server```
5. Запустите сервер
```go run /cmd/api/main.go```