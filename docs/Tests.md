# Тесты

Unit-тесты на Jest 30 и React Testing Library. Сейчас — 158 тестов в 25 файлах.

## Запуск

```bash
bun run test                                        # все тесты
bun run test:watch                                  # в режиме наблюдения
bunx jest src/utils/__tests__/normalize-phone.test.ts  # один файл
bunx jest -t "дубликат"                             # по названию
bunx jest --selectProjects server                   # только серверные
```

## Конфигурация

`jest.config.ts` собирает два проекта через `next/jest`:

| Проект | Окружение | Какие файлы |
|---|---|---|
| `client` | `jsdom`, `jest.setup.ts` | `src/**/*.test.{ts,tsx}`, кроме серверных |
| `server` | `node` | `src/server/**/*.test.ts`, `src/app/**/route.test.ts` |

Окружение выбирается конфигурацией, а не комментарием `@jest-environment` в файле: в проекте не пишут комментарии в коде.

`jest.setup.ts` подключает `@testing-library/jest-dom` и заглушки, которых нет в jsdom: `scrollIntoView`, `scrollTo`, `IntersectionObserver`.

`.env.test` фиксирует `NEXT_PUBLIC_DOMAIN=http://localhost`. `next/jest` подхватывает `.env`, и без этого файла тесты редиректов зависели бы от локальных настроек.

## Моки и помощники

| Файл | Что делает |
|---|---|
| `__mocks__/react-hot-toast.ts` | `toast.promise` дожидается промиса и вызывает `success` / `error`; остальные методы — `jest.fn()`. Включается через `jest.mock('react-hot-toast')` |
| `__mocks__/navigatorMock.js` | `useRouter` с общими `replace` / `push` / `refresh`, `usePathname`, `useSearchParams`, `redirect` |
| `__mocks__/styleMock.js` | заглушка для CSS |
| `__tests__/helpers/wrapper.tsx` | `renderWrapper(component)` и `createQueryWrapper()` — изолированный `QueryClient` без повторов и `LazyMotion` |

## Соглашения

- Тесты лежат в папке `__tests__` рядом с кодом.
- Названия `describe` / `it` — на русском и описывают поведение.
- `jest.mock()` стоит над импортами и принимает **относительный** путь. Плагин сортировки импортов в тестах отключён, чтобы он не переставлял моки.
- Замоканные функции типизируются через `jest.mocked(...)`.
- Стор сбрасывается в `beforeEach`:

```ts
const initialState = useChatsStore.getState()

beforeEach(() => {
	useChatsStore.setState(initialState, true)
})
```

## Что покрыто

| Область | Что проверяется |
|---|---|
| `utils` | разбор уведомлений (текст, ссылки, цитаты, группы, игнор служебных), нормализация номеров, chatId, инициалы, форматирование времени |
| `store` | создание и обновление чатов, автосоздание, дедупликация, порядок сообщений, смена владельца, что попадает в localStorage |
| `services` | адреса и тела запросов к прокси |
| `api` | разбор ошибок, перехватчик 401 |
| `hooks` | паузы и отмена в `usePolling`, обработка и удаление уведомлений, гидрация, сортировка |
| `server` | сборка URL, разбор ошибок GREEN-API, cookie, валидация входа, `resolveUrl`, редиректы `proxy.ts` |
| route handlers | вход (статусы инстанса, не-WhatsApp, cookie), белый список прокси, выход |
| компоненты | поле ввода (Enter, Shift+Enter, лимит), список чатов, пузыри, форма входа, панель нового чата, переключение экранов на мобильных |
| константы | пресеты анимаций |

## Пример (фрагмент)

```ts
jest.mock('../../services/green-api.service', () => ({
	__esModule: true,
	default: { receiveNotification: jest.fn(), deleteNotification: jest.fn() }
}))
jest.mock('react-hot-toast')

import { renderHook, waitFor } from '@testing-library/react'

import greenApiService from '../../services/green-api.service'
import { useChatsStore } from '../../store/chats.store'
import { useNotifications } from '../useNotifications'

const receive = jest.mocked(greenApiService.receiveNotification)
const remove = jest.mocked(greenApiService.deleteNotification)

it('кладёт входящее сообщение в стор и удаляет уведомление', async () => {
	receive.mockResolvedValueOnce(NOTIFICATION).mockImplementation(() => new Promise(() => {}))

	renderHook(() => useNotifications())

	await waitFor(() => expect(remove).toHaveBeenCalledWith(9))
	expect(useChatsStore.getState().chats['777']).toBeDefined()
})
```
