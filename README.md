# PlantAI — Инвестиционный сайт

Статичный сайт-визитка для привлечения инвестиций в PlantAI.  
Стек: HTML + CSS + ванильный JS, serverless-функция на Vercel (Node 20).

---

## Быстрый старт

```bash
# 1. Установите Vercel CLI (если не установлен)
npm install -g vercel

# 2. Клонируйте/скачайте проект и перейдите в папку
cd plant.ai

# 3. Создайте файл с переменными окружения
cp .env.example .env.local
# Откройте .env.local и заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID

# 4. Запустите локально
vercel dev
# → Откройте http://localhost:3000
```

---

## Настройка Telegram-бота

### Шаг 1 — Создать бота через @BotFather

1. Откройте Telegram и найдите **@BotFather**.
2. Напишите `/newbot`.
3. Введите имя бота (например, `PlantAI Leads`).
4. Введите username бота (например, `plantai_leads_bot`).
5. BotFather пришлёт **токен** вида `1234567890:ABCDefgh...` — скопируйте его.

### Шаг 2 — Узнать свой Chat ID

**Вариант A — личный чат с ботом:**

1. Напишите `/start` своему новому боту.
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
   ```
3. В ответе найдите `"chat":{"id": XXXXXXXXX}` — это ваш Chat ID.

**Вариант B — группа/канал:**

1. Добавьте бота в группу или канал как администратора.
2. Напишите любое сообщение в группе.
3. Откройте `getUpdates` как выше — `id` будет отрицательным числом (например, `-1001234567890`).

### Шаг 3 — Заполнить .env.local

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCDefgh-XXXXXXXXXXXXXXXXXXXXXXXX
TELEGRAM_CHAT_ID=123456789
```

---

## Деплой на Vercel

### Через CLI

```bash
# Первый деплой (создаст проект на Vercel)
vercel

# Добавить переменные окружения
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID

# Деплой в продакшен
vercel --prod
```

### Через веб-интерфейс

1. Зайдите на [vercel.com](https://vercel.com) → **Add New Project**.
2. Импортируйте репозиторий с GitHub (или загрузите папку).
3. Vercel автоматически обнаружит `vercel.json`.
4. Перейдите в **Settings → Environment Variables**:
   - Добавьте `TELEGRAM_BOT_TOKEN` → значение токена.
   - Добавьте `TELEGRAM_CHAT_ID` → значение chat id.
5. Нажмите **Deploy**.

> Переменные окружения **никогда** не попадают в клиентский код — они доступны только в serverless-функциях.

---

## Проверка формы

### Локально (vercel dev)

```bash
# В одном терминале
vercel dev

# В другом — тест API напрямую
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест Тестов","company":"AgriVC","message":"Хотим инвестировать в PlantAI!"}'
```

Ожидаемый ответ: `{"ok":true}`  
В Telegram должно прийти сообщение.

### Тест защиты от спама (honeypot)

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Бот","message":"Спам","website":"http://spam.com"}'
# → {"ok":true} без отправки в Telegram
```

---

## Структура проекта

```
plant.ai/
├── index.html          # Главная страница
├── styles.css          # Стили (mobile-first, без фреймворков)
├── script.js           # Интерактивность, валидация формы
├── vercel.json         # Конфигурация Vercel (роуты, заголовки)
├── .env.example        # Шаблон переменных окружения
├── api/
│   └── contact.js      # Serverless-функция → Telegram Bot API
└── assets/
    └── team/           # Фото команды (abduaziz.jpg, azatbek.jpg, salamat.jpg)
```

---

## Фото команды

Положите файлы в `assets/team/`:

| Файл            | Кто              |
|-----------------|------------------|
| `abduaziz.jpg`  | Доспанов Абдуазиз |
| `azatbek.jpg`   | Утемаганбетов Азатбек |
| `salamat.jpg`   | Айтмуратов Саламат |

Если файл не найден — автоматически показываются инициалы на зелёном фоне.

---

## Безопасность

- Токен и Chat ID хранятся **только в переменных окружения** сервера.
- Форма защищена honeypot-полем (невидимое поле `website`).
- Все входящие данные санируются на сервере.
- Заголовки безопасности (`X-Frame-Options`, `X-Content-Type-Options` и др.) настроены в `vercel.json`.
