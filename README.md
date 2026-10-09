# Timeline

Домашнее задание по теме «Geolocation, Notification, Media».

![Deploy](https://github.com/ТВО_ЛОГИН/timeline-app/actions/workflows/deploy.yml/badge.svg)

**Живая версия:** https://ТВО_ЛОГИН.github.io/timeline-app/

## Функционал

- ✅ Текстовые посты с координатами
- ✅ Аудио-посты (запись с микрофона)
- ✅ Видео-посты (запись с камеры)
- ✅ Модальное окно для ручного ввода координат при отказе Geolocation API
- ✅ Автотесты парсера координат (Jest) — 5 тестов

## Технологии

- Webpack 5, HtmlWebpackPlugin, css-loader, style-loader
- date-fns
- Jest + Babel

## Запуск

```bash
npm install --legacy-peer-deps
npm start