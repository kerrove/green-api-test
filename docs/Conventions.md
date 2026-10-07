# Соглашения

## Правила проекта

- **Без комментариев в коде** — ни в исходниках, ни в тестах, ни в конфигах. Код должен объяснять себя именами.
- **Компоненты** — `export const Component: FC<Props> = () => { return ... }`, `interface Props` объявляется в том же файле над компонентом.
- **Страницы, layout и `Providers`** — `export default function`.
- **Секреты** не попадают в клиентский JavaScript: только httpOnly-cookie и серверный код.
- **SOLID**: компоненты отображают, хуки управляют состоянием, сервисы делают запросы, чистая логика — в `utils`, зависимости передаются параметрами.
- **React Compiler** включён — `useMemo` / `useCallback` для мемоизации не нужны.

## Именование файлов

| Что | Формат | Пример |
|---|---|---|
| Компонент | PascalCase | `MessageBubble.tsx` |
| Хук | `useXxx.ts` | `useNotifications.ts` |
| Сервис | `*.service.ts` | `green-api.service.ts` |
| Конфиг | `*.config.ts` | `pages.config.ts` |
| Стор | `*.store.ts` | `chats.store.ts` |
| Типы | `*.types.ts` | `chat.types.ts` |
| Серверный модуль | `*.server.ts`, `*.middleware.ts` | `credentials.server.ts` |
| Утилита | kebab-case | `parse-notification.ts` |

## Типы

- Интерфейсы начинаются с `I` (`IChat`), псевдонимы типов — с `T` (`TPollingTask`).
- Перечисления — объект `as const` плюс одноимённый тип:

```ts
export const EnumMessageDirection = {
	INCOMING: 'incoming',
	OUTGOING: 'outgoing'
} as const
export type EnumMessageDirection = (typeof EnumMessageDirection)[keyof typeof EnumMessageDirection]
```

- Включён `verbatimModuleSyntax`: импорт только типов пишется как `import type`.

## Экспорты

- Сервисы — класс + синглтон по умолчанию: `export default greenApiService`.
- Конфиги — классы со `static readonly` полями: `Pages`, `MutationKeys`.
- Компоненты, хуки, утилиты — именованные экспорты.

## Пути импорта

Алиасы без `@/` (`tsconfig.json`):

| Алиас | Путь |
|---|---|
| `components/*` | `src/components/*` |
| `forms/*` | `src/components/forms/*` |
| `ui/*` | `src/components/ui/*` |
| `services/*`, `providers/*`, `constants/*`, `store/*`, `hooks/*`, `utils/*`, `api/*`, `server/*`, `types/*` | `src/<имя>/*` |
| `config/*` | `src/configs/*` |
| `src/*` | `src/*` |
| `tests/*` | `__tests__/*` |

## Форматирование

Prettier (`.prettierrc`) — источник истины:

- табы, без точек с запятой, одинарные кавычки (в том числе в JSX);
- ширина строки 100, без висячих запятых, `arrowParens: avoid`;
- по одному JSX-атрибуту на строку.

Импорты автоматически сортируются плагином `@trivago/prettier-plugin-sort-imports` по группам с пустой строкой между ними:

```
сторонние → services → components → forms → ui → providers → constants
→ config → store → hooks → utils → api → server → types → относительные
```

В тестах сортировка отключена, чтобы `jest.mock` оставался над импортами.

## Стили

- Tailwind CSS 4, конфигурация в `src/app/globals.css` (без `tailwind.config`).
- Классы объединяются через `twMerge(...)` и `clsx` (импортируется как `cn`) для условий.
- Цвета — только через токены из `globals.css`, без произвольных HEX в компонентах. Исключение — градиенты аватаров в `utils/get-avatar-color.ts`.

## Проверки перед коммитом

```bash
bun run lint
bunx tsc --noEmit
bun run test
bun run check
```
