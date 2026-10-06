# Подключение отзывов к Supabase

Форма сайта сохраняет отзыв в таблицу `public.reviews` со статусом `pending`. На сайте видны только записи со статусом `published`.

## Создать таблицу

1. Создай проект на [supabase.com](https://supabase.com/).
2. В проекте открой **SQL Editor → New query**.
3. Скопируй содержимое файла `supabase/schema.sql` и нажми **Run**.

После этого таблица появится в **Table Editor → reviews**.

## Подключить проект

В Supabase возьми **Project URL** и **Secret API key** в **Project Settings → API Keys**. Ключ должен начинаться с `sb_secret_`.

Для локального запуска создай файл `.env.local` в корне проекта:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SECRET_KEY=sb_secret_твой_секретный_ключ
```

Не публикуй Secret API key и не добавляй его в браузерный код.

Для сайта на Vercel добавь эти же две переменные в **Project → Settings → Environment Variables** для Production и Preview, затем запусти новый deployment.

## Одобрять отзывы

Открой **Supabase → Table Editor → reviews**. Новые отзывы имеют статус `pending`. Чтобы показать отзыв на сайте, поменяй его `status` на `published`. Для скрытия установи `rejected` или верни `pending`. Опубликованные отзывы появятся на сайте при следующей загрузке страницы.
