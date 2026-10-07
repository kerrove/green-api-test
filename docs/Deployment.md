# Запуск и деплой

## Требования

- [Bun](https://bun.sh) 1.3+ — менеджер пакетов и запуск скриптов
- [Node.js](https://nodejs.org) 20.9+ — рантайм Next.js
- WhatsApp-инстанс в [личном кабинете GREEN-API](https://console.green-api.com) со статусом «авторизован» и пустым `webhookUrl`

## Переменные окружения

| Переменная | Пример | Назначение |
|---|---|---|
| `NEXT_PUBLIC_DOMAIN` | `http://localhost:3000` | базовый адрес для серверных редиректов (`/logout`, `proxy.ts`) |
| `MODE` | `development` | метка окружения; кодом приложения не читается |

Файлы:

| Файл | Когда читается |
|---|---|
| `.env` | всегда, в том числе при сборке Docker-образа |
| `.env.test` | в тестах, поверх `.env` |

Креды GREEN-API **не хранятся** в переменных окружения: пользователь вводит их на странице входа, и они живут в httpOnly-cookie.

> Переменные `NEXT_PUBLIC_*` Next.js подставляет при сборке. После изменения `NEXT_PUBLIC_DOMAIN` приложение нужно пересобрать.

## Скрипты

| Команда | Что делает |
|---|---|
| `bun install` | установка зависимостей |
| `bun run dev` | dev-сервер на `0.0.0.0:3000` |
| `bun run dev-local` | то же с явным `--turbopack` |
| `bun run build` | production-сборка (перед ней очищается `.next`) |
| `bun run start` | production-сервер на `0.0.0.0:3000` |
| `bun run prod` | сборка и запуск |
| `bun run test` | unit-тесты |
| `bun run lint` | ESLint с Prettier |
| `bun run check` | Knip: неиспользуемые файлы, экспорты и зависимости |
| `bun run format` | Prettier для `src/**/*.{ts,tsx}` |

## Локальный запуск

```bash
bun install
bun run dev
```

Приложение откроется на <http://localhost:3000>.

## Docker

```bash
docker build -t green-api-chat .
docker run -d --name green-api-chat -p 3000:3000 green-api-chat
```

Остановить и удалить:

```bash
docker rm -f green-api-chat
```

### Как устроен образ

`Dockerfile` — двухэтапный, на базе `node:22-slim`. Бинарник Bun копируется из `oven/bun:1.3.8`.

1. **builder** — `bun install`, копирование исходников, `bun run build`.
2. **production** — копирует `.next`, `public`, `package.json`, `next.config.ts`, `.env`, `bun.lock`, `tsconfig.json`, ставит production-зависимости и TypeScript (нужен для `next.config.ts`), запускает `bun run start`.

Next.js работает под Node, а не под рантаймом Bun: в образе `oven/bun` без Node сборка Next 16 падает с ошибкой `Expected CommonJS module to have a function wrapper` при загрузке серверных модулей.

`.dockerignore` пропускает в образ из env-файлов только `.env` и `.env.production`.

### HTTPS

В production cookie ставятся с флагом `Secure`. Браузеры принимают такие cookie на `http://localhost`, но на любом другом адресе нужен HTTPS (например, reverse-proxy с TLS перед контейнером). Иначе вход не сохранится.
