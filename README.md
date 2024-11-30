Для выполнения тестового задания решил выбрать фреймворк NestJS. Swagger документация будет доступна после запуска контейнера Docker по адресу: [SwaggerUI](http://localhost:3000/api/docs)

### Запуск

1. Запуск через Docker на порту 3000 и 5432
   [VSCode](https://code.visualstudio.com/docs/containers/overview) | [Docker](https://habr.com/ru/articles/663026/)
2. Запуск через терминал на порту 3000 (должен быть установлен PostgreSQL + изменить `.env` параметры `POSTGRES_HOST` и `POSTGRES_PORT`)
   `npm run start:dev` - DEV
   `npm run start` - PROD

## Модели

| Модель в запросе | Модель           |
| ---------------- | ---------------- |
| `gpt`            | gpt-4o           |
| `gemini`         | gemini-1.5-flash |

Добавление моделей происходит посредством добавления новых сервисов с моделями + добавление модели в `src/ai-manager/enum/models.enum.ts`

#### class AiModel:

Два значения: `model`(модель, есть типизация TiktokenModel), `price` (стоимость одного токена)

Constructor() - если нет встроенного метода подсчета токенов, то `token-cost.service.ts` предоставляет аналог `countTokens(chunk: string)`

Функция `generateStream` должна принимать в себя 4 параметра (prompt, onChunk(callback), countCost(callback))
`prompt` - промпт, ответ на который будет стримиться.
`onChunk` - в каждой итерации передаем новый чанк (`onChunk(chunk: string)`)
`countCost` - передаем стоимость за использованные токены (`countCost(this.CountTokenCost.calculateCost(totalTokens, this.price))`)
`abortSignal` - обработчик завершения стрима ответа(Подписываемся до цикла `abortSignal.subscribe(() => {})` и выходим из цикла)
