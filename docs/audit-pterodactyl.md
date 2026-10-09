# Pterodactyl: проверка инструкций

Последняя проверка: 2026-10-09; первичная проверка: 2026-10-01. Этот файл — рабочая карта свидетельств для редактора, он находится вне публичного `content/`.

## Дополнение 2026-10-09: единый вход и участники

Повторно прочитаны развёрнутые исходники `/var/www/pterodactyl` по SSH и выбранные исходники интеграции биллинга. `.env`, приватные конфигурации, БД, сеансы, пользовательские журналы и файлы серверов не читались. Приложение, artisan, тесты интеграции и браузерные сценарии не запускались; приглашения и изменения аккаунтов не выполнялись. Наличие кода не является проверкой доставки писем, действующих feature flags или успешного прохождения OAuth конкретным аккаунтом. Браузерную проверку при необходимости координирует root отдельно.

`/var/www/pterodactyl` не является Git-репозиторием, поэтому точный Git-diff этого развёртывания с 1 октября получить из него нельзя. В `/root/billing` вывод `git log --since=2026-10-01` заканчивается коммитами `3c600b4` и `1e0708d` от 1 октября; каталог `integrations/pterodactyl/` находится в рабочем дереве как untracked. Актуальные выводы ниже основаны на текущих файлах, а не на предположении, что история Git полностью описывает production.

Перед чтением пакета прочитаны `/root/billing/integrations/pterodactyl/AGENTS.md`, `README.md` и сведения baseline из `manifest.json`. Это инструкции для ремонта addon; выполнялась только редакторская проверка без установки, изменения кода или запуска приложения. Пакет имеет `package_version: 2026.10.08.2`. Его manifest описывает проверенную исходную базу как Pterodactyl 1.15.1 / Laravel 12.64.0 / PHP 8.3.33 от 8 октября; это сведения manifest, а не независимая проверка runtime. Старая верхняя запись changelog 1.12.3 не используется как текущая версия панели.

### Подтверждённые изменения

Все относительные пути Pterodactyl ниже отсчитываются от `/var/www/pterodactyl`. Выбранные исходники для локального чтения находятся в `/tmp/haku-ptero-docs-20261009` и не входят в вики.

| Поведение                                                                                                                                                   | Источники                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Кнопка **Войти через Haku Billing** добавлена отдельно от обычного входа; отображение зависит от включения SSO                                              | `resources/views/templates/auth/core.blade.php:6`; обычные маршруты сохранены в `routes/auth.php`                                        |
| OAuth-вход, callback, привязка и дополнительный checkpoint находятся под `/auth/haku/`                                                                      | `app/Providers/HakuServiceProvider.php:36`; `app/Http/Controllers/Auth/HakuSsoController.php:17`                                         |
| Переход с параметром сервера возвращает к нужному серверу; уже связанная личность не подменяет открытый другой аккаунт панели                               | `HakuSsoController.php:23`, `:57`, `:63`                                                                                                 |
| Несвязанная личность видит **Привязать аккаунт панели**; требуется обычный вход в Ptero, повторное подтверждение его пароля и при включении 2FA её проверка | `HakuSsoController.php:73`, `:85`; `resources/views/haku/link.blade.php`; `HakuCheckpointController.php`                                 |
| Нет автоматической привязки по совпадению email и нет создания пользователя в SSO callback; конфликт существующей связи не перезаписывается                 | `app/Services/Haku/IdentityLinks.php`; `HakuSsoController.php:51`; `resources/views/haku/link.blade.php`                                 |
| Ptero TOTP / recovery code проверяются и при входе через биллинг                                                                                            | `HakuSsoController.php:66`; `HakuCheckpointController.php`; `resources/views/haku/checkpoint.blade.php`                                  |
| Сеанс, созданный через биллинг, зависит от действующего сеанса Haku; самостоятельный вход с паролем и уже созданные API-ключи не становятся SSO-сеансами    | `app/Http/Middleware/HakuSession.php`; `AbstractLoginController.php`; README интеграции, раздел SSO and account linking                  |
| Парольная аутентификация SFTP остаётся паролем Pterodactyl; привязка OAuth не заменяет его                                                                  | `app/Http/Controllers/Api/Remote/SftpAuthenticationController.php`; неизменённый блок SFTP интерфейса                                    |
| Технический список участников является списком Ptero, который читается и изменяется также из биллинга                                                       | `app/Http/Controllers/Api/Haku/AccessController.php`; `app/Services/Haku/AccessStore.php`; `app/Providers/HakuServiceProvider.php:47`    |
| Делегат выдаёт только свои технические права, не меняет владельца и собственный доступ                                                                      | `app/Services/Haku/AccessPolicy.php`; `app/Http/Middleware/HakuNativeMemberWrite.php`; native `SubuserController.php`                    |
| Приглашение по email может создать Ptero-аккаунт и письмо настройки, не требуя аккаунта биллинга                                                            | `app/Services/Subusers/SubuserCreationService.php`; `app/Services/Users/UserCreationService.php`; `app/Notifications/AccountCreated.php` |
| Удаляется участие на конкретном сервере, а не аккаунт и все его серверы; отключение ранее открытых соединений может ожидать подтверждения узла              | `AccessController.php:125`; `HakuSubuserObserver.php`; `AccessStore.php`; billing `static/ptero-members.js:83`                           |

Связанные источники биллинга проверены по выбранной копии `/tmp/haku-billing-20261009`, предоставленной billing-агентом:

- `routes/main.py:1626` рендерит `templates/dashboard.html`, где кнопка карточки — **Управлять**; `templates/service_detail.html:19` — **Перейти в панель** внутри карточки. Неиспользуемый в этом маршруте `templates/my_services.html` с другими названиями кнопок не является основанием для инструкции.
- `sso.py`, `launch_service`: `/services/<id>/panel` направляет в `/auth/haku/start?server=...`; перед этим для владельца возможна привязка по проверенной принадлежности существующего сервера.
- `ptero_access.py:89`, `ensure_owner_binding`: проверка записанного сервера и его владельца; существующий конфликт связи или принадлежности не перезаписывается; email не служит доказательством.
- `templates/service_ptero_members.html`: **Участники Pterodactyl**, технические права общие с панелью; приглашение без аккаунта биллинга допустимо; права оплаты выдаются отдельно.
- `static/ptero-members.js:83`: интерфейс явно отличает отзыв прав от ещё ожидающего подтверждения отключения открытых соединений.
- Billing-агент подтвердил по `service_access.py` / `ptero_access.py`, что привязанный native subuser может получить просмотр карточки, но оплата, тариф и домены этим не выдаются. Полное описание в `docs/audit-billing.md` и статьях `billing/panel-login`, `billing/sharing`.
- Stack-агент подтвердил общий вход через биллинг и общий список разрешений участников HakuStack. В `start/panels.md` это отделено от двух групп прав Pterodactyl.

Обновлены `pterodactyl/access`, `users`, `security`, `files`, `index` и `start/panels`. Схема `panels-map.svg` обновляется root отдельно. Скриншоты 1 октября остаются иллюстрациями обычных разделов панели; они не выдаются за визуальную проверку новых OAuth-форм или нового блока участников в биллинге.

### Визуальная сверка публичной формы входа — 2026-10-09

Root отдельно открыл публичную страницу входа Pterodactyl во временном браузерном контексте без пользовательского сеанса и подготовил `content/assets/screenshots/pterodactyl-oauth.webp`. Существующий сеанс пользователя не завершался. Вход через биллинг, вход с паролем, привязка, 2FA и восстановление не выполнялись; формы не отправлялись.

Готовый публичный WebP независимо просмотрен редактором без обращения к live-панели, CDP или приватным исходным снимкам. В нём видны кнопка **Войти через Haku Billing**, обычная форма с пустыми полями имени пользователя/email и пароля, кнопка **Войти** и ссылка **Установить новый пароль**. Личных значений на кадре нет; подписи и элементы управления читаемы. В `pterodactyl/access` добавлены ссылка на полный размер, alt и поясняющая подпись.

Это read-only подтверждение внешнего вида и наличия двух способов входа на публичной странице. Последовательность OAuth, подтверждение привязки паролем, проверка TOTP/recovery, отзыв SSO-сеансов и синхронизация участников по-прежнему описаны по указанным выше исходникам, а не как пройденные операции под аккаунтом.

## Историческая проверка 2026-10-01

Ниже сохранён исходный аудит. Его утверждения об отсутствии SSO и о единственном способе входа заменены дополнением выше.

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
