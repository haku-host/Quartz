#!/usr/bin/env python3
"""Generate the five original, self-contained Haku wiki SVG diagrams.

Run from any directory with Python 3. No network or third-party packages needed.
Only files under content/assets/illustrations are written.
"""

from html import escape
from pathlib import Path


DEST = Path(__file__).resolve().parents[1] / "content/assets/illustrations"

STYLE = """
text { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #16213b; }
.canvas { fill: #fafbff; }
.outline { fill: none; stroke: #d9e2f3; stroke-width: 1.5; }
.card { fill: #fff; stroke: #d9e2f3; stroke-width: 1.5; }
.blue-card { fill: #edf3ff; stroke: #c9dafa; stroke-width: 1.5; }
.green-card { fill: #eaf7f2; stroke: #c6e5d9; stroke-width: 1.5; }
.blue-fill { fill: #245bd6; }
.green-fill { fill: #226e63; }
.blue-ink { fill: #245bd6; }
.green-ink { fill: #226e63; }
.muted { fill: #53647e; }
.white { fill: #fff; }
.tiny { font-size: 18px; }
.body { font-size: 21px; }
.heading { font-size: 28px; font-weight: 720; letter-spacing: -0.6px; }
.label { font-size: 24px; font-weight: 700; letter-spacing: -0.3px; }
.blue-line { fill: none; stroke: #245bd6; stroke-width: 2.7; stroke-linecap: round; stroke-linejoin: round; }
.green-line { fill: none; stroke: #226e63; stroke-width: 2.7; stroke-linecap: round; stroke-linejoin: round; }
.route { fill: none; stroke: #8399ba; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.route-fill { fill: #8399ba; }
.guide { fill: none; stroke: #d9e2f3; stroke-width: 1.5; stroke-dasharray: 3 7; }
.soft-blue { fill: #d5e3ff; }
.soft-green { fill: #c5e9dc; }
.quiet { fill: #e8eef9; }
@media (prefers-color-scheme: dark) {
  text { fill: #f3f6ff; }
  .canvas { fill: #0d1426; }
  .outline { stroke: #28354f; }
  .card { fill: #141f35; stroke: #30405c; }
  .blue-card { fill: #182c4d; stroke: #304c79; }
  .green-card { fill: #143832; stroke: #326359; }
  .blue-ink { fill: #91bbff; }
  .green-ink { fill: #8bd7c1; }
  .blue-fill { fill: #245bd6; }
  .green-fill { fill: #226e63; }
  .muted { fill: #b4c2da; }
  .white { fill: #fff; }
  .blue-line { stroke: #91bbff; }
  .green-line { stroke: #8bd7c1; }
  .route { stroke: #7c94b7; }
  .route-fill { fill: #7c94b7; }
  .guide { stroke: #30405c; }
  .soft-blue { fill: #294572; }
  .soft-green { fill: #29584b; }
  .quiet { fill: #24324d; }
}
"""

SYMBOLS = """
<marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
  <path d="M1 1 L7 4.5 L1 8" class="route"/>
</marker>
<symbol id="server" viewBox="0 0 80 80">
  <rect x="9" y="9" width="62" height="26" rx="7" class="blue-card"/>
  <rect x="9" y="43" width="62" height="26" rx="7" class="blue-card"/>
  <path d="M36 22 H58 M36 56 H58" class="blue-line"/>
  <circle cx="23" cy="22" r="4" class="blue-fill"/><circle cx="23" cy="56" r="4" class="blue-fill"/>
</symbol>
<symbol id="system" viewBox="0 0 80 80">
  <rect x="6" y="9" width="68" height="49" rx="8" class="green-card"/>
  <path d="M6 23 H74 M25 34 L32 41 L25 48 M40 48 H54 M32 58 V70 M48 58 V70 M24 71 H56" class="green-line"/>
  <circle cx="15" cy="16" r="2" class="green-fill"/><circle cx="23" cy="16" r="2" class="green-fill"/>
</symbol>
<symbol id="cube" viewBox="0 0 80 80">
  <path d="M40 7 L72 24 V57 L40 75 L8 57 V24Z" class="blue-card"/>
  <path d="M8 24 L40 42 L72 24 M40 42 V75 M24 16 L56 33 M24 33 L56 16" class="blue-line"/>
  <path d="M18 43 L28 49 V61 L18 55Z" class="soft-blue"/>
  <path d="M50 48 L63 41 V53 L50 60Z" class="soft-blue"/>
</symbol>
<symbol id="wallet" viewBox="0 0 80 80">
  <path d="M12 22 L56 9 V26 H12Z" class="soft-blue"/>
  <rect x="10" y="23" width="60" height="44" rx="9" class="blue-card"/>
  <path d="M53 37 H72 V54 H53 A8 8 0 0 1 53 37Z" class="blue-card"/>
  <circle cx="58" cy="45.5" r="3" class="blue-fill"/>
  <path d="M22 37 H37 M22 46 H34" class="blue-line"/>
</symbol>
<symbol id="folder" viewBox="0 0 80 80">
  <path d="M8 24 Q8 17 15 17 H31 L39 26 H65 Q72 26 72 33 V61 Q72 68 65 68 H15 Q8 68 8 61Z" class="green-card"/>
  <path d="M10 33 H70" class="green-line"/>
  <path d="M27 48 L36 57 L53 40" class="green-line"/>
</symbol>
<symbol id="database" viewBox="0 0 80 80">
  <path d="M15 21 V60 C15 75 65 75 65 60 V21" class="green-card"/>
  <ellipse cx="40" cy="21" rx="25" ry="11" class="green-card"/>
  <path d="M15 40 C15 55 65 55 65 40 M15 58 C15 73 65 73 65 58" class="green-line"/>
</symbol>
<symbol id="check" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="29" class="green-card"/>
  <path d="M25 40 L36 51 L56 29" class="green-line"/>
</symbol>
"""


def text(x, y, value, cls="body", size=None, weight=None, anchor=None):
    extra = ""
    if size is not None:
        extra += f' style="font-size:{size}px"'
    if weight is not None:
        extra += f' font-weight="{weight}"'
    if anchor:
        extra += f' text-anchor="{anchor}"'
    return f'<text x="{x}" y="{y}" class="{cls}"{extra}>{escape(value)}</text>'


def rect(x, y, w, h, cls="card", radius=20):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" class="{cls}"/>'


def icon(name, x, y, size=64):
    return f'<use href="#{name}" x="{x}" y="{y}" width="{size}" height="{size}"/>'


def arrow(path):
    return f'<path d="{path}" class="route" marker-end="url(#arrow)"/>'


def pill(x, y, label, width, color="blue", size=18):
    return rect(x, y, width, 32, f"{color}-fill", 16) + text(
        x + width / 2, y + 22, label, "white", size=size, weight=650, anchor="middle"
    )


def svg(name, title, description, height, body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="{height}" viewBox="0 0 640 {height}" role="img" aria-labelledby="{name}-title {name}-desc" xml:lang="ru">
<title id="{name}-title">{escape(title)}</title>
<desc id="{name}-desc">{escape(description)}</desc>
<defs><style>{STYLE}</style>{SYMBOLS}</defs>
{rect(1, 1, 638, height-2, 'canvas', 26)}
{rect(1, 1, 638, height-2, 'outline', 26)}
<g aria-hidden="true">
{body}
</g>
</svg>
'''


def header(title, subtitle):
    return text(32, 48, title, "heading") + text(32, 82, subtitle, "muted", size=20)


def panels():
    body = header("Услуга подскажет нужную панель", "Начните с карточки услуги в личном кабинете")
    body += rect(32, 110, 576, 152)
    body += icon("wallet", 50, 127, 74)
    body += text(142, 151, "Биллинг Haku Host", "label", size=27)
    body += text(142, 186, "Заказ · оплата · продление", "muted", size=21)
    body += pill(142, 207, "«Открыть панель»", 218)
    body += arrow("M320 262 V291 H170 V320")
    body += arrow("M320 291 H470 V320")
    body += '<circle cx="320" cy="291" r="4" class="route-fill"/>'
    body += rect(32, 326, 276, 230, "blue-card")
    body += rect(332, 326, 276, 230, "green-card")
    body += text(56, 369, "Pterodactyl", "label", size=28)
    body += text(356, 369, "HakuStack", "label", size=28)
    body += icon("cube", 56, 387, 67)
    body += icon("system", 356, 387, 67)
    body += text(56, 481, "Игры и приложения", "body", size=21)
    body += text(56, 519, "Консоль · файлы · запуск", "muted", size=18)
    body += text(356, 481, "VDS / Linux", "label")
    body += text(356, 519, "ОС · SSH · службы", "muted", size=20)
    body += rect(32, 581, 576, 96)
    body += text(54, 617, "HakuStack — аккаунт Haku Host", "body", size=21)
    body += text(54, 651, "Pterodactyl — отдельный аккаунт", "muted", size=21)
    return svg("panels-map", "Как выбрать панель Haku Host", "Откройте карточку услуги в биллинге. Кнопка «Открыть панель» ведёт в Pterodactyl для игр и приложений или HakuStack для VDS. HakuStack использует аккаунт Haku Host, Pterodactyl — отдельный аккаунт.", 702, body)


def service_choice():
    body = header("Сколько управления вам нужно?", "Выберите среду под задачи своего проекта")
    body += rect(32, 112, 576, 225, "blue-card")
    body += text(56, 157, "Окружение приложения", "label", size=27)
    body += pill(56, 177, "Pterodactyl", 136)
    body += icon("cube", 492, 171, 75)
    body += text(56, 248, "Вы управляете кодом, файлами", "body", size=22)
    body += text(56, 280, "и параметрами запуска.", "body", size=22)
    body += text(56, 315, "Среда задаётся шаблоном услуги.", "muted", size=20)
    body += rect(32, 361, 576, 225, "green-card")
    body += text(56, 406, "Виртуальный сервер", "label", size=27)
    body += pill(56, 426, "HakuStack", 132, "green")
    body += icon("system", 492, 418, 75)
    body += text(56, 497, "Вы управляете ОС, пакетами,", "body", size=22)
    body += text(56, 529, "службами и сетью внутри VDS.", "body", size=22)
    body += text(56, 564, "Систему настраиваете вы.", "muted", size=20)
    body += rect(32, 612, 576, 81)
    body += text(56, 646, "Нужны свои системные службы?", "label", size=23)
    body += text(56, 674, "Начните с выбора VDS.", "green-ink", size=21)
    return svg("service-choice", "Окружение приложения или VDS", "В Pterodactyl пользователь управляет приложением в заданной среде. На VDS через HakuStack он управляет операционной системой, пакетами, службами и сетью. Для собственных системных служб следует оценить VDS.", 720, body)


def migration():
    body = header("Перенос с проверкой данных", "Сначала проверка, затем переключение")
    steps = [
        (112, 138, "Подготовить копию", "Файлы + настройки + экспорт базы", "Храните её отдельно от проекта", "blue"),
        (279, 138, "Перенести и проверить", "Новая среда → запуск → тесты", "Пользователи пока на старом сервере", "blue"),
        (446, 153, "Переключить пользователей", "Остановить запись → последние данные", "Затем обновить адрес или DNS", "green"),
        (628, 138, "Сохранить путь назад", "Оставьте старую копию до проверки", "Настройте регулярные бэкапы", "green"),
    ]
    for i, (y, height, title, line1, line2, color) in enumerate(steps, 1):
        body += rect(32, y, 576, height, f"{color}-card")
        body += f'<circle cx="70" cy="{y+40}" r="20" class="{color}-fill"/>'
        body += text(70, y+48, str(i), "white", size=23, weight=700, anchor="middle")
        body += text(109, y+47, title, "label", size=24)
        body += text(56, y+88, line1, "body", size=21)
        body += text(56, y+119, line2, "muted", size=20)
        if i < len(steps):
            body += arrow(f"M70 {y+height} V{steps[i][0]-7}")
    return svg("migration-flow", "Четыре шага переноса проекта", "Создайте независимую копию файлов, настроек и базы. Перенесите данные и проверьте новую среду. Остановите запись на старом сервере, перенесите последние данные и переключите адрес. Сохраните старую копию до проверки и настройте резервирование.", 793, body)


def dns():
    body = header("Домен → адрес игрового сервера", "Схема подключения Minecraft Java")
    body += rect(32, 111, 576, 101, "blue-card")
    body += text(56, 148, "Игрок вводит", "muted", size=20)
    body += text(56, 184, "play.example.com", "label", size=29)
    body += icon("cube", 521, 128, 64)
    body += arrow("M320 212 V242")
    body += rect(32, 249, 576, 147)
    body += pill(56, 272, "SRV", 61)
    body += text(132, 295, "_minecraft._tcp.play.example.com", "muted", size=19)
    body += text(56, 337, "Цель: node.example.com", "label", size=25)
    body += text(56, 371, "Порт: из панели вашей услуги", "body", size=22)
    body += arrow("M320 396 V426")
    body += rect(32, 433, 576, 113, "green-card")
    body += pill(56, 455, "A", 47, "green")
    body += text(119, 478, "node.example.com → IPv4 услуги", "body", size=22)
    body += text(56, 520, "В A-записи только IP, без порта", "muted", size=21)
    body += arrow("M320 546 V576")
    body += rect(32, 583, 576, 94)
    body += icon("server", 49, 598, 64)
    body += text(132, 619, "Соединение с сервером", "label", size=25)
    body += text(132, 651, "IPv4 + порт из SRV", "muted", size=22)
    body += text(32, 712, "DNS не исправляет недоступный прямой адрес.", "muted", size=19)
    return svg("minecraft-dns", "Как A и SRV связывают домен с Minecraft-сервером", "Java-клиент получает SRV-запись для play.example.com: цель node.example.com и порт услуги. A-запись цели возвращает IPv4. Клиент подключается к этому IP и порту из SRV. Домены в схеме приведены как пример.", 738, body)


def backups():
    body = header("Резервная копия — вне VDS", "Проверка восстановления входит в план")
    body += rect(32, 115, 264, 219, "blue-card")
    body += rect(344, 115, 264, 219, "green-card")
    body += text(56, 155, "Рабочий VDS", "label", size=25)
    body += text(367, 155, "Хранилище копии", "label", size=23)
    body += icon("server", 56, 173, 78)
    body += icon("folder", 367, 173, 78)
    body += text(56, 280, "Файлы и настройки", "body", size=20)
    body += text(56, 311, "Дамп базы данных", "muted", size=20)
    body += text(367, 280, "Ваш компьютер", "body", size=21)
    body += text(367, 311, "или другой носитель", "muted", size=20)
    body += arrow("M296 225 H337")
    body += arrow("M476 334 V357 H320 V377")
    body += rect(32, 384, 576, 139)
    body += icon("check", 46, 400, 74)
    body += text(132, 425, "Пробное восстановление", "label", size=25)
    body += text(132, 461, "Проверьте данные и запуск", "body", size=22)
    body += text(132, 495, "в отдельной тестовой среде", "muted", size=21)
    body += rect(32, 549, 576, 157)
    body += text(56, 587, "Сохраните вместе с копией", "label", size=24)
    for y, line in [(622, "дату и состав данных"), (653, "версии программ и настройки"), (684, "порядок восстановления")]:
        body += f'<circle cx="63" cy="{y-7}" r="4" class="green-fill"/>'
        body += text(80, y, line, "muted", size=21)
    body += text(32, 742, "Архив на этом же VDS удалится при переустановке.", "muted", size=18)
    return svg("vds-backups", "План резервного копирования VDS", "Создайте копию файлов и настроек и отдельный дамп базы. Перенесите их с рабочего VDS на компьютер или другой носитель. Проверьте восстановление в отдельной среде. Храните дату копии, версии программ и порядок восстановления. Копия внутри VDS не переживёт переустановку.", 767, body)


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    diagrams = {
        "panels-map.svg": panels(),
        "service-choice.svg": service_choice(),
        "migration-flow.svg": migration(),
        "minecraft-dns.svg": dns(),
        "vds-backups.svg": backups(),
    }
    for name, content in diagrams.items():
        path = DEST / name
        path.write_text(content, encoding="utf-8")
        print(f"{path.relative_to(DEST.parents[2])}: {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
