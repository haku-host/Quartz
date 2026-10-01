# Pterodactyl: проверка инструкций

Дата проверки: 2026-10-01. Этот файл — рабочая карта свидетельств для редактора, он находится вне публичного `content/`.

## Область проверки

- Read-only SSH к серверу приложений, исходники `/var/www/pterodactyl` и строки `server_name` из конфигурации nginx.
- Не читались `.env`, базы, личные данные клиентов, содержимое серверов клиентов, журналы с пользовательскими событиями или секретами.
- Не создавались аккаунты, серверы, базы, ключи, задачи и копии. Не отправлялись изменяющие запросы к панели.
- Функции подтверждены исходниками развёрнутого приложения, а не проверкой действий под клиентским аккаунтом. Это не подтверждает лимиты конкретного тарифа, наличие свободных портов, доставку писем или исправность всех рабочих сценариев.
- `AGENTS.md` в дереве Pterodactyl и в рабочем репозитории не найден.

## Адреса и связь с биллингом

| Утверждение                                                                                                                       | Свидетельство                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Адрес панели `https://ptero.haku.host`                                                                                            | `/etc/nginx/sites-enabled/pterodactyl.conf`: `server_name ptero.haku.host`                 |
| Прямой вход `/auth/login`; восстановление `/auth/password`                                                                        | `routes/auth.php`; `resources/scripts/routers/AuthenticationRouter.tsx`                    |
| Вход по имени пользователя или email; ссылка «Установить новый пароль»                                                            | `resources/scripts/components/auth/LoginContainer.tsx`                                     |
| В биллинге карточка `/dashboard/service/<id>` открывается из `/dashboard`; кнопка «Открыть панель» зависит от `service.panel_url` | Независимая проверка billing-агентом: `templates/service_detail.html`                      |
| Аккаунт Pterodactyl отдельный, пароль при первой покупке отправляется на почту                                                    | Billing-агент: явный текст `templates/service_detail.html:20`                              |
| Смена Egg и Startup command в карточке услуги                                                                                     | Billing-агент: `templates/service_detail.html`; документация `content/billing/services.md` |

Внешняя попытка открытия `https://ptero.haku.host` инструментом web завершилась ошибкой доступности; `https://haku.host` показал отказ Anubis. Ни статус работы Pterodactyl, ни сценарий входа по этим попыткам не оценивались. Достоверные пути и подписи получены из исходников и nginx. В статьях не обещается SSO; в `routes/auth.php` обнаружен обычный вход, без SSO-роута.

## Версия и особенности интерфейса

Верхняя запись `CHANGELOG.md` — `v1.12.3`; это свидетельство версии исходной базы, а не самостоятельная проверка версии всех развернутых компонентов. Версия Wings не проверялась.

`resources/scripts/i18n.ts` задаёт русский язык с английским fallback. `resources/scripts/routers/routes.ts` содержит реальные подписи вкладок:

- Аккаунт: «Аккаунт», «API-ключи», «SSH-ключи», «Активность».
- Сервер: «Консоль», «Файлы», «Базы данных», «Планировщик», «Пользователи», «Резервные копии», «Сеть», «Запуск», «Настройки», «Активность».

Перевод смешанный: например, пометка `Read Only`, отдельное сообщение об отключённой переустановке и пустом каталоге остались английскими. Статьи используют реальные русские подписи доступных действий.

В `FileEditContainer.tsx` обнаружено хранение черновиков **новых** файлов в `sessionStorage`. Статьи не представляют это как гарантию сохранности: существующий файл нужно сохранять кнопкой, а черновик не является резервной копией.

## Карта статей и исходников

Все относительные серверные пути в таблице отсчитываются от `/var/www/pterodactyl`.

| Статья                     | UI и основные исходники                                                                                                                                                                                                | Подтверждённые детали                                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pterodactyl/index.md`     | `resources/scripts/routers/routes.ts`; `routes/api-client.php`                                                                                                                                                         | Разделы сервера и аккаунта, группы разрешений, путь `/server/:id`                                                                                                             |
| `pterodactyl/access.md`    | `routes/auth.php`; `components/auth/LoginContainer.tsx`; `routers/AuthenticationRouter.tsx`; `components/server/settings/SettingsContainer.tsx`                                                                        | Вход, восстановление, separate account из billing, UUID сервера в отладочной информации                                                                                       |
| `pterodactyl/console.md`   | `components/server/console/ServerConsoleContainer.tsx`, `PowerButtons.tsx`, `ServerDetailsBlock.tsx`                                                                                                                   | «Старт», «Стоп», «Рестарт», «Убить» во время stopping; сообщения о maintenance/install/transfer; адрес, аптайм, CPU, RAM, disk, RX/TX                                         |
| `pterodactyl/files.md`     | `components/server/files/FileManagerContainer.tsx`, `FileDropdownMenu.tsx`, `FileEditContainer.tsx`; `components/server/settings/SettingsContainer.tsx`                                                                | Ограничение браузерного списка 250; операции файла; явное сохранение; SFTP host/port, username `<username>.<id>`, пароль панели                                               |
| `pterodactyl/startup.md`   | `components/server/startup/StartupContainer.tsx`, `VariableBox.tsx`; `routes/api-client.php`                                                                                                                           | Команда для просмотра, image choices, запрет изменения custom image; read-only variables; автоматическое сохранение переменной с debounce; изменяемые поля зависят от шаблона |
| `pterodactyl/backups.md`   | `components/server/backups/BackupContainer.tsx`, `CreateBackupButton.tsx`, `BackupContextMenu.tsx`; `app/Services/Backups/InitiateBackupService.php`                                                                   | Лимит, `.pteroignore`, download/restore/lock/delete; checkbox удаления всех файлов; блокировка управления при restore; ротация только незаблокированных копий                 |
| `pterodactyl/schedules.md` | `components/server/schedules/EditScheduleModal.tsx`, `TaskDetailsModal.tsx`, `ScheduleEditContainer.tsx`, `RunScheduleButton.tsx`                                                                                      | Пять полей cron; активность и only-online; command/power/backup; задержка 0–900 с, первая игнорируется; continue-on-failure; next/last run; немедленное выполнение            |
| `pterodactyl/databases.md` | `components/server/databases/CreateDatabaseButton.tsx`, `DatabaseRow.tsx`, `RotatePasswordButton.tsx`; `routes/api-client.php`                                                                                         | Имя 3–48; поле источника подключений; пустое→`%`; connection host/port, name, user, password/JDBC; rotate password; необратимое удаление                                      |
| `pterodactyl/network.md`   | `components/server/network/NetworkContainer.tsx`, `AllocationRow.tsx`; `components/server/console/ServerDetailsBlock.tsx`                                                                                              | Выделенные адреса/порты, alias, лимит, «Создать порт», заметка, «Сделать Основным», основной не удаляется из этой строки                                                      |
| `pterodactyl/users.md`     | `components/server/users/UsersContainer.tsx`, `EditSubuserModal.tsx`, `UserRow.tsx`                                                                                                                                    | Email приглашения, индивидуальные permissions, выдача только собственных прав, редактирование/удаление, флаг 2FA                                                              |
| `pterodactyl/reinstall.md` | `components/server/settings/ReinstallServerBox.tsx`; `routes/api-client.php`                                                                                                                                           | Повторный install script, остановка, изменение/удаление файлов, отдельное право, отключение при skipScripts                                                                   |
| `pterodactyl/security.md`  | `components/dashboard/AccountOverviewContainer.tsx`; `forms/ConfigureTwoFactorForm.tsx`, `SetupTOTPDialog.tsx`, `CreateApiKeyForm.tsx`; `ssh/AccountSSHContainer.tsx`, `CreateSSHKeyForm.tsx`; `routes/api-client.php` | Пароль/email, 2FA QR+6 digits+password+recovery tokens; public SSH key; API key IP restriction и показ созданного секрета; журнал аккаунта и сервера                          |

Пути `components/...`, `routers/...`, `forms/...`, `ssh/...` в таблице относятся к `resources/scripts/`, причём `forms` и `ssh` — подпапки `resources/scripts/components/dashboard/`.

## HTTP-поверхность, соответствующая UI

Для редакторской проверки маршрутов, без примеров вызова и без пользовательских идентификаторов:

- Вкладки сервера: `/server/:id`, `/files`, `/databases`, `/schedules`, `/users`, `/backups`, `/network`, `/startup`, `/settings`, `/activity`.
- Аккаунт: `/account`, `/account/api`, `/account/ssh`, `/account/activity`.
- `routes/api-client.php` подтверждает клиентские группы `files`, `schedules`, `network/allocations`, `users`, `backups`, `startup`, `settings` и `databases`, каждая привязана к разрешённому серверу.

## Оговорки, которые сохранены в статьях

1. Доступность вкладок зависит от прав и состояния сервера; лимиты не фиксируются числами для всех тарифов.
2. Нет обещания, что пароль от биллинга подходит Pterodactyl, и нет выдуманной кнопки сброса Ptero-пароля в биллинге.
3. Номера SFTP/игровых/DB-портов берутся из конкретной карточки; постоянные номера и адреса узлов не выдумываются.
4. Образ среды выполнения не считается версией файлов приложения. Обновление версии и переустановка зависят от egg; универсальной переустановки «без потери данных» нет.
5. Часовой пояс cron на сервере не считывался из конфигурации с секретами. Пользователю предложено сверить «Следующий запуск», а не обещано московское время.
6. Копии файлов не объявляются экспортом внешней MySQL-базы или снимком всех настроек панели. Требуется отдельное сохранение базы.
7. Для задач backup подтверждена ротация старейшей незаблокированной копии; блокировка всех копий может исчерпать лимит.
8. SSH-ключи не объявляются shell-доступом. API-ключи не сопровождаются примерами административной автоматизации.
9. Публичный `pma.haku.host` обнаружен в nginx, но ссылка не добавлена: клиентский сценарий доступа phpMyAdmin, его адресная политика и авторизация не проверялись.
10. Проверка через живой аккаунт клиента не выполнялась; письма, разрешения и операции не подтверждены end-to-end.

## Локальная проверка текста

Созданы 12 файлов: index и 11 тематических статей. Во всех frontmatter `title`, `description`, `modified: 2026-10-01`; нет заголовков H1 и русских имён файлов. Внутренние ссылки раздела проверены по существующим файлам. Межраздельные ссылки используют согласованные slug `billing/index`, `billing/services`, `billing/domains`, `hakustack/index`, `minecraft/index`, `help/index` и проверяются общей сборкой.

## Дополнительная визуальная сверка — 2026-10-01

После обычного входа владельца открыта прямая ссылка игровой панели из биллинговой карточки «Wiki Testserver MC». Список прочих серверов не использовался для съёмки. Проверены консоль остановленного сервера, файлы, запуск, сеть и настройки, а также открыты без отправки формы резервной копии, расписания, приглашения пользователя и базы данных.

Опубликованы 10 кадров в `content/assets/screenshots/pterodactyl-*.webp`. Снимки сделаны при горизонтальном viewport 1280 × 900, обрезаны до нужных блоков. Адреса, порты, SFTP-реквизиты и служебный идентификатор закрыты непрозрачными масками; профиль и посторонние услуги исключены из кадра. Подписи отделяют пример конфигурации от общих требований.

Сервер не запускался, команды не отправлялись, параметры и файлы не менялись; копии, расписания, пользователи и базы не создавались. Кнопка переустановки не нажималась. Эта сверка подтверждает интерфейс, а не успешное выполнение операций. После съёмки отдельная рабочая вкладка закрыта.
