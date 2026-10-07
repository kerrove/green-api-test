# Состояние и данные

## Модель данных

Файл: `src/types/chat.types.ts`.

```ts
interface IMessage {
	id: string
	text: string
	timestamp: number
	direction: 'incoming' | 'outgoing'
}

interface IChat {
	chatId: string
	title: string
	phone?: string
	messages: IMessage[]
	updatedAt: number
}

interface IChatEvent {
	chatId: string
	title?: string
	message: IMessage
}
```

`id` сообщения — `idMessage` из GREEN-API; по нему убираются дубликаты. Время хранится в миллисекундах.

## Стор чатов

Файл: `src/store/chats.store.ts` (Zustand + `persist`).

| Поле | Назначение | Сохраняется |
|---|---|---|
| `ownerId` | `idInstance`, которому принадлежит история | да |
| `chats` | `Record<chatId, IChat>` | да |
| `activeChatId` | открытый чат | нет |

| Действие | Что делает |
|---|---|
| `syncOwner(id)` | если владелец сменился — сбрасывает историю |
| `upsertChat({ chatId, title, phone })` | создаёт чат или обновляет название, не трогая сообщения |
| `addMessage(event)` | добавляет сообщение; создаёт чат, если его нет; игнорирует дубликат по `id`; держит сообщения по времени; двигает `updatedAt` |
| `setActiveChat(id \| null)` | открывает или закрывает чат |
| `reset()` | возвращает начальное состояние |

Автосоздание чата при входящем от незнакомого собеседника — это поведение `addMessage`, отдельной логики нет.

Исходящее сообщение, отправленное через API, приходит ещё и уведомлением `outgoingAPIMessageReceived` с тем же `idMessage`. Дедупликация по `id` не даёт ему задвоиться.

### Гидрация

Стор создан с `skipHydration: true`: сервер рендерит пустой список, и без этого клиент получил бы рассинхрон гидрации.

`hooks/useChatsHydration.ts`:

1. после монтирования вызывает `useChatsStore.persist.rehydrate()`;
2. вызывает `syncOwner(idInstance)` — если вошли под другим инстансом, история очищается;
3. возвращает `isHydrated`.

`ChatPage` включает опрос уведомлений только после гидрации, иначе новые сообщения могли бы затереться восстановленным состоянием.

### Чтение стора

Компоненты подписываются на отдельные поля селекторами:

```ts
const activeChatId = useChatsStore(state => state.activeChatId)
const setActiveChat = useChatsStore(state => state.setActiveChat)
```

`hooks/useSortedChats.ts` возвращает чаты, отсортированные по `updatedAt` (новые сверху). Мемоизацию делает React Compiler.

## Хуки

| Хук | Файл | Назначение |
|---|---|---|
| `usePolling(task, options)` | `hooks/usePolling.ts` | универсальный цикл с паузами, отменой и остановкой при скрытой вкладке |
| `useNotifications(enabled)` | `hooks/useNotifications.ts` | задача для `usePolling`: получить → разобрать → сохранить → удалить |
| `useChatsHydration(ownerId)` | `hooks/useChatsHydration.ts` | восстановление истории из localStorage |
| `useSortedChats()` | `hooks/useSortedChats.ts` | отсортированный список чатов |
| `useLogin()` | `components/forms/login/useLogin.ts` | форма и мутация входа |
| `useCreateChat(onCreated)` | `components/forms/new-chat/useCreateChat.ts` | форма и мутация нового чата |
| `useSendMessage(chatId)` | `components/chat/window/useSendMessage.ts` | отправка сообщения |

### `usePolling`

```ts
type TPollingTask = (signal: AbortSignal) => Promise<boolean>
```

Задача возвращает `true`, если что-то получила (следующий запрос сразу), или `false` (пауза `idleDelay`). Ошибка вызывает `onError` и паузу `errorDelay`. При размонтировании `AbortController` прерывает текущий запрос. Хук ничего не знает о GREEN-API, поэтому тестируется отдельно.

## TanStack Query

Используется для мутаций: вход, создание чата, отправка сообщения. Ключи — в `configs/query/mutation-keys.config.ts`:

```ts
export class MutationKeys {
	static readonly LOGIN = ['login']
	static readonly CREATE_CHAT = ['create chat']
	static readonly SEND_MESSAGE = (chatId: string) => ['send message', chatId]
}
```

`QueryClient` создаётся в `configs/query/query-options.config.ts` (один на браузер, новый на каждый серверный рендер) и подключается в `providers/Providers.tsx`. В dev-режиме доступны React Query Devtools.

Получение сообщений сделано не через `useQuery`, а через `usePolling`: это long-polling с удалением уведомлений, а не кэшируемые данные.

## Формы

Каждая форма — пара «хук + презентационный компонент». Хук возвращает `IHookForm<T>`:

```ts
interface IHookForm<T> {
	form: UseFormReturn<T>
	isPending: boolean
	onSubmit: SubmitHandler<T>
}
```

- Валидация — правила `react-hook-form` и регулярные выражения из `utils/validators/fields.validator.ts`.
- Поля входа обрезают пробелы через `setValueAs`, чтобы копирование из консоли не ломало проверку.
- Мутации оборачиваются в `toast.promise`; текст ошибки берётся из `errorCatch` (`api/api.helper.ts`).

## Ошибки на клиенте

`errorCatch(error)` возвращает строку для показа пользователю:

1. строка — как есть;
2. ошибка axios — `response.data.message` из прокси, иначе сообщение axios;
3. `Error` — его `message`;
4. иначе — «Что-то пошло не так».

Ошибки опроса показываются одним тостом с фиксированным `id`, который скрывается после первого успешного запроса.
