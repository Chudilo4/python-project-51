# file <page_loader.py>


import logging
import os
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from progress.bar import Bar

from page_loader.create_dir import create_dir
from page_loader.download_img import download_files
from page_loader.format_file import format_files


def download(url, path_os):
    logging.basicConfig(level='INFO')  # Задаём уровень логирования
    logger = logging.getLogger()  # Задаём логер
    logger.info(f'request url : {url}')  # Вывод в консоль о запращиваемой странице
    logger.info(f'output path : {path_os}')  # Вывод в консоль о пути куда скачается страница
    html = requests.get(url)  # Запрос страницы
    if html.status_code != 200:
        raise Warning(f'Status_code is {html.status_code}')
    rs = urlparse(url)  # Парисм урл строку
    format_url = format_files(rs.netloc + rs.path)  # Форматируем строку в формат 'site-com.html'
    path_html = os.path.join(path_os, format_url)  # Задаём путь для записи html файла
    logger.info(f'write html file : {path_html}')  # Выводим полный путь до HTML файла
    a = html.text  # Забираем код с запрошеной страницы
    soup = BeautifulSoup(a, 'html.parser')  # Задаём парсер для скаченого кода страницы
    path_dir_filers = create_dir(path_os, rs.netloc + rs.path)  # Создаём папку формата site-com_files
    tag2 = {'img': 'src',
            'script': 'src',
            'link': 'href'
            }  # Задаём Теги кода HTML страницы которые нас интересуют
    bar = Bar('Loading', fill='@', suffix='%(percent)d%%')  # Задаём визуальны бар загрузчка файлов в папку
    ff = os.path.split(path_dir_filers)
    for tag, ref in tag2.items():  # Циклом проходимся по интересующим нас тегов
        for link in soup.select(tag):  # Выбираем по тегу интесующие ссылки
            url_img = link.get(ref)  # Получаем ссылку
            url_img2 = urlparse(url_img)  # Парсим ссылку на наличие Домена
            url33 = urlparse(url)  # Парсим основную ссылку скачивания на наличие домена
            if url_img2.netloc == '' or url_img2.netloc == url33.netloc:
                rr = download_files(url_img, url, path_dir_filers)  # Меняем ссылки локальных фалов и скачиваем интересующие нас файлы
                link[tag2[tag]] = os.path.join(ff[-1], rr)
                bar.next()
    bar.finish()
    b = soup.prettify()
    with open(path_html, 'w') as file:
        file.write(b)
        file.close()
    return path_html
