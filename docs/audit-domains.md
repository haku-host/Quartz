# Восстановление руководства по собственному домену

Проверено 2026-10-09. Пользователь указал, что после переписи вики исчезла инструкция по подключению внешнего домена.

## История

`content/guides/domain.md` создан в `48cbd15278e6a2cbe41c10a8b8d42e3eba42e26c` 26 декабря 2024 года. Последняя редакция — `b328e9d0c515333dec0ac3262cf47b97d863387e`; удаление — `acdecff62d263bd81fb87142db426e381108e0ab` 1 октября 2026 года. До удаления содержимое совпадало с декабрьской редакцией.

Потеряны покупка и отдельное продление домена, подключение зоны Cloudflare, смена NS в Reg.ru и пример Minecraft по корню домена без порта. A/SRV частично сохранились в `minecraft/domains.md`, A для VDS — в `hakustack/network.md`. Старый адрес `guides/domain` ошибочно вёл в `billing/domains`, где описаны зоны Haku.

## Восстановление

- Новая `help/custom-domain.md` восстанавливает полный путь: регистрация, выбор DNS-провайдера, Cloudflare, NS у регистратора, записи для VDS, переход к Minecraft и проверка DNS.
- `minecraft/domains.md` дополнена адресами с портом и без него, A для игрового имени/целевого узла, SRV для поддомена и корня, раздельными полями DNS-панелей и проверкой через `nslookup`.
- `scripts/legacy-urls.json` направляет `guides/domain` на общую восстановленную статью. Добавлены переходы с главной, из начала работы, биллинга, HakuStack, Pterodactyl и раздела помощи.
- Новая SVG показывает роли регистратора, DNS-провайдера и сервера; применяется текущая светлая/тёмная палитра. Старые снимки кабинетов не используются как изображение нынешнего интерфейса.

Исправлены ошибки прежнего материала: неверная ссылка `clouflare.com`, совет удалить все обнаруженные записи зоны, неполное имя SRV на старом снимке и обещание подключения без порта без уточнения клиента. Для SRV используется `_minecraft._tcp`, адрес цели имеет A и не является CNAME. Примеры NS, IP и портов старого аккаунта не переносятся. Free предлагается как вариант DNS-плана Cloudflare, а не как способ бесплатной регистрации домена. Указан отдельный шаг DNSSEC при смене провайдера.

## Актуальные источники

- [Добавление домена в Cloudflare](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/): `Domains → Onboard a domain`, основное имя, план, сверка записей, назначенные NS.
- [Primary setup Cloudflare](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/): Free/Pro, делегация, сохранение записей, DNSSEC до и после смены NS.
- [Смена DNS-серверов в Reg.ru](https://help.reg.ru/support/dns-servery-i-nastroyka-zony/rabota-s-dns-serverami/kak-propisat-dns-dlya-domena-v-lichnom-kabinete-reg-ru): текущие названия разделов и свой список NS, заявленный срок до 24 часов.
- [Типы DNS-записей](https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/) и [режимы Cloudflare](https://developers.cloudflare.com/dns/proxy-status/): A/AAAA, TTL, SRV, различие DNS only и HTTP-прокси.
- [RFC 2782](https://www.rfc-editor.org/rfc/rfc2782): `_Service._Proto.Name`, порт и целевой узел, запрет alias в Target.
- [Microsoft: nslookup](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/nslookup): запрос типа записи из командной строки.

Проверка выполнена по Git, публичной документации и существующим статьям о панелях. Аккаунты регистраторов и Cloudflare не открывались, домены не покупались, DNS и настройки клиентских серверов не изменялись. Примеры `example.com` служат шаблонами, успешное подключение к ним не заявляется. Публикация проверяется сборкой, существующим `check:wiki`, локальными переходами и HTTP-проверкой обоих адресов вики.
