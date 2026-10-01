# Сверка руководств по Minecraft-плагинам

Дата: 2026-10-01. Область работы: четыре новые страницы `content/minecraft/{coreprotect,essentials,luckperms,volleyball}.md`. Старые `content/mc-plugins` изучены как исходный пользовательский материал, не удалялись и не изменялись.

На каждой странице `title`, `description`, `modified: 2026-10-01`, ссылка на общую установку плагинов, законченный рабочий сценарий и проверка ошибок. Объём рассчитан на 200–350 слов. Изменений runtime, выдачи прав игрокам или установки плагинов не выполнялось. Команды проверены по первичным источникам, но не запускались на игровом сервере.

## CoreProtect

Первичные источники:

- [Официальный справочник команд](https://docs.coreprotect.net/commands/): inspect, lookup, rollback, status, параметры `u`, `t`, `r`, `a:-block`, `#preview`.
- [ApplyCommand.java](https://github.com/PlayPro/CoreProtect/blob/master/src/main/java/net/coreprotect/command/ApplyCommand.java): `/co apply` применяет сохранённый preview с исходной локацией и временем.
- [CancelCommand.java](https://github.com/PlayPro/CoreProtect/blob/master/src/main/java/net/coreprotect/command/CancelCommand.java): `/co cancel` отменяет сохранённый preview.
- Изученная вершина `PlayPro/CoreProtect/master`: `7582ab4d8ead649c88b9e1457b4c911d31db6586` (2026-09-29).

Вместо глобальных откатов старой статьи приведён один локальный сценарий: игрок, 30 минут, радиус 5 блоков, только сломанные блоки; lookup → preview → apply/cancel. Команды выполняются администратором в игре у целевого участка, не из консоли без координат. Добавлена резервная копия до изменения мира. Старые списки `item`-действий и значение радиуса `/co near` не переносились: текущая официальная документация отличается от старой статьи.

## EssentialsX

Первичные источники:

- [Installing EssentialsX](https://essentialsx.net/wiki/installing): основной JAR, необязательные модули, установка и перезапуск.
- [Module Breakdown](https://essentialsx.net/wiki/modules): Core, Spawn, Chat, AntiBuild; Vault и менеджер прав для групп/префиксов чата.
- [Официальный список разрешений](https://essentialsx.net/permissions): `essentials.sethome`, `essentials.home`.
- [plugin.yml](https://github.com/EssentialsX/Essentials/blob/2.x/Essentials/src/main/resources/plugin.yml): `sethome`, `home`, синтаксис и aliases.
- Изученная вершина `EssentialsX/Essentials/2.x`: `cfb6f12da302337f627df93709a290668ebf1ffd` (2026-09-26).

Убраны непроверенные списки permissions из стороннего сайта, прежний диапазон совместимости «1.8 — почти последняя» и смешение настроек отдельных модулей. Базовый сценарий даёт обычной группе ровно два права для одного дома. Нет обещания, что `/spawn` или форматирование чата появятся от одного основного JAR. Поведение тестируется игроком без OP.

## LuckPerms

Основной сайт wiki требует JavaScript; фактический текст прочитан из официального репозитория `LuckPerms/wiki`, директория `pages`:

- [Command-Usage.md](https://github.com/LuckPerms/wiki/blob/master/pages/Command-Usage.md): aliases, console vs in-game, `creategroup`, `permission`, `parent`.
- [Permission-Commands.md](https://github.com/LuckPerms/wiki/blob/master/pages/Permission-Commands.md): set, check, диагностика результата проверки.
- [Parent-Commands.md](https://github.com/LuckPerms/wiki/blob/master/pages/Parent-Commands.md): add/remove/info.
- [Installation.md](https://github.com/LuckPerms/wiki/blob/master/pages/Installation.md): разные сборки по платформам, папки plugins/mods, перезапуск.
- [Web-Editor.md](https://github.com/LuckPerms/wiki/blob/master/pages/Web-Editor.md): редактор отдельной группы, Save и выполнение выданной команды применения.
- Изученная вершина `LuckPerms/wiki/master`: `fc2919c3d5e6bfba82af31f9930273b00f08ddbf` (2026-06-16).

Публичная статья ссылается на официальные страницы luckperms.net; GitHub сохранён здесь как читаемый источник сверки. Используется `parent add`, сохраняющий остальные группы; нет примеров выдачи `*` или админ-доступа ради обычной команды. Отдельно показаны проверка и удаление добавленного членства. Не утверждается, что удаление группы убирает права, выданные иным путём.

## Volleyball

Первичные источники:

- [README](https://github.com/IEnumerablee/Volleyball): создание мяча через живую фугу и 8 кожи, ЛКМ/Shift, `ballskin`, `ballsreload`, сборка с canvas/Maven.
- [pom.xml](https://github.com/IEnumerablee/Volleyball/blob/master/pom.xml): версия `1.4+1.20-1.21`, Java target 17, dependency Spigot API 1.20, встроенная при сборке библиотека canvas.
- [plugin.yml](https://github.com/IEnumerablee/Volleyball/blob/master/src/main/resources/plugin.yml): API marker 1.19, команды, право `volleyball.reload`.
- Изученная вершина `IEnumerablee/Volleyball/master`: `8396d1061aff635a44c02698cb943ff4f0fdae61` (2026-07-13).

Сохранён credit первоначальному автору статьи **larden**. Удалено старое противоречивое утверждение о прекращении обновлений в 2023 году. Версия проекта обозначена явно, но поддержка каждого патча Minecraft, новейших версий или конкретного ядра не гарантируется. `api-version: 1.19` не принят за исчерпывающий диапазон совместимости. Не заявлено наличие готового GitHub Release; предложен проверенный JAR автора либо сборка по README. Не переносились устаревающие шаги интерфейса стороннего сервиса генерации скинов.

## Проверки

Выполнена локальная проверка этих четырёх файлов: frontmatter, отсутствие дублирующего H1, существование wikilinks, объём и наличие первичных ссылок. Ошибок не найдено. Объём текста без frontmatter по словам, разделённым пробелами: CoreProtect — 278, EssentialsX — 283, LuckPerms — 305, Volleyball — 304. Общие formatter, check, build и публикация не запускались, чтобы не мешать параллельным изменениям основного агента.
