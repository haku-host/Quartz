---
title: Привязка домена
tags:
  - Панель
  - Туториал
  - Домен
description: Инструкция по привязке своего домена к серверу
---
мне задавали вопросы в духе "а можно ли / а как привязать свой домен?"  
Эта статья - ответ.


# Покупка домена
> Вообще домен можно получить бесплатно через [dot.tk](https://dot.tk) или [freenom.com](https://freenom.com) , но там много подводных камней. Это не будет рассматриваться здесь. Можете погуглить XD

Автор статьи рекомендует сайт [reg.ru](https://reg.ru) для покупки доменов. Там может и нет некоторых смешных доменов, типо [.gay](https://archlinux.gay)
## Просмотр доступных имен
Для начала необходимо просмотреть доступные доменные имена на сайте reg.ru.  
Для этого там есть поиск:  
![[/pictures/Pasted image 20241226003723.png]]  
Например купим домен `.xyz`. Регру - контора ... и пытается навязать кучу хлама с доменом. Удаляйте это всё нафиг и продожайте.  
![[/pictures/Pasted image 20241226003858.png]]  

 Должна остаться исключительно услуга покупки домена  
 ![[/pictures/Pasted image 20241226004016.png]]  
 > Имейте ввиду, что вы покупаете домен на 1 год. Его продление будет стоить, зачастую, дороже, чем сумма за первый год.  
 
 Интересности я вам рассказал, дальше как нибудь сами сможете купить домен (надеюсь).  


# Добавление домена в cloudflare
## Регистрация на сайте cloudflare
Необходимо зарегистрироваться на [cloudflare.com](https://clouflare.com/).  
## Добавление
Далее добавляем наш домен на cloudflare.  
На сайте вы увидите кнопку `Add a domain`. Жмём на неё.  

![[/pictures/Pasted image 20241226004737.png]]
Далее нам захотят продать много всего, но внизу есть бесплатный план. Жмём на него.  
![[/pictures/Pasted image 20241226004817.png]]

# Создание записей
`vashdomen.ru` - ваш домен  
![[/pictures/Pasted image 20241226005129.png]]  
Уберите все записи, которые там нашёл клаудфлейр и добавляйте 2 свои.
## А запись
Для создания A записи нужно узнать IP адрес ноды. Для этого можно её пропинговать. Сделать это можно командой `ping доменноды` в cmd.  
![[/pictures/Pasted image 20241226005303.png]]  

Теперь, когда мы узнали IP адрес - надо создать вспомогательную запись
![[/pictures/Pasted image 20241226005351.png]]

## SRV запись

![[/pictures/Pasted image 20241226005847.png]]  
Где `портсервера` - это порт, используемый вашим сервером для подключения.
Сервис - `_minecraft`.


## Смена nameservers
Далее cloudflare попросит сменить nameservers на собственные.  
![[/pictures/Pasted image 20241226010029.png]]  

![[/pictures/Pasted image 20241226010106.png]]  
Открываем панель управления доменом в регру.  
В опции `DNS-Серверы и управление зоной` нажмите на кнопку `Изменить`.  


![[/pictures/Pasted image 20241226010255.png]]  
Далее `Свой список DNS-серверов`.  

![[/pictures/Pasted image 20241226010354.png]]  
Указывает сервера, которые нам ранее дал cloudflare.     

После установки новых nameservers нужно будет немного подождать (до 24 часов), пока регистратор домена не применит необходимые изменения.

# Заключение
Теперь на ваш сервер можно будет зайти по адресу `ваш.домен` без всяких `:порт`.  
