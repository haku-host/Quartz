---
title: EssentialsX
description: Команды, пермишины, настройки
tags:
  - Minecraft
  - Плагин
  - Утилиты
---

# Дисклеймер
Стаью помогал писать "начинающий стажер", скажем так. 
Редактура велась!!! Но спустя рукава, потому что главный редактор Quinowell использовал EssentialsX всего пару раз за всё время.

# Установка

1. Убедитесь, что используете bukkit и его производные: Spigot, Paper, Purpur, Pufferfish, Heart и другие. Поддерживаемые версии 1.8 - +-последняя (на момент написания статьи 1.21.2)
1. Скачайте EssentialsX. Сделать это можно на [гитхабе проекта](https://github.com/EssentialsX/Essentials/releases).
1. Переместите .jar файл в папрку plugins.
1. Перезагрузите сервер. 

# Настройка EssentialsX

В этом разделе преставлены лишь самые главные настройки плагина, потому что все блин 400 пукнтов я и мой помощник в написании статей описывать не собираемся ¯\_(ツ)_/¯.

## Самые используемые

`ops-name-color`: Задаёт цвет имени админов сервера.
`nickname-prefix`: Префикс, добавляемый к никнеймам игроков, чтобы отличать их от настоящих имен.
`max-nick-length`: Максимальная длина никнейма игрока.
`nick-blacklist`: Список слов или фраз, запрещённых к использованию в никнеймах.
`teleport-safety`: Включает или выключает безопасную телепортацию, предотвращая телепортацию в опасные места.

## Экономика

`starting-balance`: Начальный баланс новых игроков.
`currency-symbol`: Символ валюты.
`max-money`,`min-money`: Максимальный и минимальный допустимый баланс игроков.

## Права и защита

`build`, `use`: Настройки разрешений на строительство и использование предметов для игроков без соответствующих прав.
`disable`: Различные параметры для отключения урона от падения, утопления, огня и других источников.

## Спавн, дома и телепортация

`spawn-on-join`: Определяет, должны ли игроки телепортироваться на спавн при входе на сервер.
`sethome-multiple`: Конфигурация множественных домов для разных групп игроков.
`respawn-at-home`: Устанавливает, должны ли игроки возрождаться в своём доме после смерти.

## Чат и сообщения

`chat`: Настройки форматирования чата, включая радиус видимости сообщений и форматы сообщений для разных групп.
`custom-join-message`, `custom-quit-message`: Настройки сообщений при входе/выходе игроков на сервер.

## Безопасность и античит

`protect`: Различные параметры для защиты мира, включая предотвращение распространения огня, взрывов TNT, повреждений от мобов и т.д.
`disable`: Настройки для отключения определённых физических эффектов и поведения, таких как урон от падения или утопления.

# Команды и их разрешения
Тут капитальный надрист, поэтому советую пользоваться функцией поиска по странице (Ctrl + F).
Тем не менее команды тоже только самые нужные 😝.
## `/bigtree`
`essentials.bigtree`  
Ставит большое дерево. Нужен инструмент, команда и достаточно места.

## `/break`
`essentials.break`  
Ломает блок под курсором.  
`essentials.break.bedrock`  
Позволяет ломать админиум.

## `/feed`
`essentials.feed`  
Восстанавливает голод.  
`essentials.feed.others`  
Позволяет восстанавливать голод другим игрокам.

## `/gamemode`
`essentials.gamemode`  
Меняет режим игры.  
`essentials.gamemode.other`  
Позволяет менять режим игры другим игрокам.

## `/give`
`essentials.give`  
Выдает предметы игроку.  
`essentials.itemspawn.exempt`  
Игнорирует черный список предметов.  
`essentials.give.item-all`  
Позволяет выдавать все предметы.  
`essentials.give.item-[itemname]`  
Выдает определенный предмет по имени.  
`essentials.give.item-[itemid]`  
Выдает определенный предмет по ID.  
`essentials.oversizedstacks`  
Позволяет выдавать стаки предметов больше 64.

## `/god`
`essentials.god`  
Включает режим бога для невосприимчивости к урону.  
`essentials.god.others`  
Включает режим бога для других игроков.

## `/heal`
`essentials.heal`  
Восстанавливает здоровье.  
`essentials.heal.cooldown.bypass`  
Игнорирует задержку между использованиями команды.  
`essentials.heal.others`  
Позволяет лечить других игроков.

## `/item`
`essentials.item`  
Выдает предметы игроку.  
`essentials.itemspawn.exempt`  
Игнорирует черный список предметов.  
`essentials.itemspawn.item-all`  
Позволяет выдавать все предметы.  
`essentials.itemspawn.item-[itemname]`  
Выдает определенный предмет по имени.  
`essentials.itemspawn.item-[itemid]`  
Выдает определенный предмет по ID.  
`essentials.oversizedstacks`  
Позволяет выдавать стаки предметов больше 64.

## `/kit`
`essentials.kit`  
Выдает набор предметов.  
`essentials.kit.[имя_набора]`  
Дает доступ к определенному набору.  
`essentials.kit.*`  
Дает доступ ко всем существующим наборам.

## `/more`
`essentials.more`  
Увеличивает количество предмета в руке до максимального стака.

## `/ptime`
`essentials.ptime`  
Устанавливает личное время для игрока.  
`essentials.ptime.others`  
Позволяет устанавливать время другим игрокам.

## `/repair`
`essentials.repair`  
Чинит предмет в руке.  
`essentials.repair.armor`  
Позволяет чинить броню.  
`essentials.repair.enchanted`  
Позволяет чинить зачарованные предметы.

## `/time`
`essentials.time`  
Меняет время в мире.  
`essentials.time.set`  
Устанавливает время.

## `/tree`
`essentials.tree`  
Ставит стандартное дерево выбранного типа.

## `/unlimited`
`essentials.unlimited`  
Дает бесконечные блоки.  
`essentials.unlimited.item-all`  
Позволяет делать бесконечными все предметы.  
`essentials.unlimited.item-[itemname]`  
Делает бесконечным определенный предмет по имени.  
`essentials.unlimited.item-[itemid]`  
Делает бесконечным определенный предмет по ID.  
`essentials.unlimited.others`  
Позволяет устанавливать бесконечные блоки для других игроков.

## `/balance`
`essentials.balance`  
Показывает баланс игрока.  
`essentials.balance.others`  
Позволяет проверять баланс других игроков.

## `/balancetop`
`essentials.balancetop`  
Показывает топ богатейших игроков.

## `/eco`
`essentials.eco`  
Управляет экономикой, изменяет баланс.  
`essentials.eco.loan`  
Позволяет давать неограниченное количество денег.

## `/pay`
`essentials.pay`  
Передает деньги другому игроку.

## `/sell`
`essentials.sell`  
Продает предмет из рук или инвентаря.

## `/setworth`
`essentials.setworth`  
Устанавливает цену на предмет.

## `/worth`
`essentials.worth`  
Показывает цену предмета.

## `/afk`
`essentials.afk`  
Отмечает игрока как отошедшего.  
`essentials.afk.kickexempt`  
Исключает игрока из авто-кика за AFK.

## `/compass`
`essentials.compass`  
Показывает текущее направление.

## `/getpos`
`essentials.getpos`  
Показывает координаты игрока.

## `/ignore`
`essentials.ignore`  
Игнорирует сообщения от другого игрока.

## `/info`
`essentials.info`  
Дает информацию о сервере.

## `/list`
`essentials.list`  
Показывает список онлайн игроков.  
`essentials.list.hidden`  
Показывает скрытых игроков.

## `/mail`
`essentials.mail`  
Управляет почтой, отправляет сообщения.  
`essentials.mail.send`  
Позволяет отправлять почтовые сообщения.

## `/me`
`essentials.me`  
Рассказывает о действиях игрока в третьем лице.

## `/motd`
`essentials.motd`  
Показывает сообщение дня.

## `/msg`
`essentials.msg`  
Отправляет личное сообщение.  
`essentials.msg.color`  
Позволяет использовать цвета в сообщениях.

## `/near`
`essentials.near`  
Показывает игроков поблизости.

## `/nick`
`essentials.nick`  
Меняет отображаемое имя.  
`essentials.nick.others`  
Позволяет менять ники других игроков.  
`essentials.nick.color`  
Позволяет использовать цвета в никах.

## `/r`
`essentials.msg`  
Отвечает на последнее личное сообщение (требуются те же права, что и у `msg`).

## `/rules`
`essentials.rules`  
Показывает правила сервера.

## `/realname`
`essentials.realname`  
Показывает настоящее имя игрока с ником.

## `/seen`
`essentials.seen`  
Показывает, когда игрок был в сети последний раз.

## `/spawner`
`essentials.spawner`  
Меняет тип спаунера мобов.  
`essentials.spawner.[имя_моба]`  
Дает разрешение на спавн определенного моба.  
`essentials.spawner.*`  
Дает разрешение на спавн всех мобов.

## `/suicide`
`essentials.suicide`  
Позволяет игроку самоубиться.

## `/whois`
`essentials.whois`  
Показывает информацию о игроке.  
`essentials.list.hidden`  
Позволяет видеть скрытую информацию о игроках.

# Источники
Для написания статьи я ~~украл~~ использовал информацию о пермишнах с https://black-minecraft.com/ , так - сайт прикольный, но пиратство это плохо.

