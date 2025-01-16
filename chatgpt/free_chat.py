from ast import main
import asyncio
from typing import Optional
from g4f.client import Client

client = Client()

text1 = "Тусклый свет фонарей тонул в густом тумане, скрывая очертания старого города, она шагала вперед, жимая в руках ключ, который, казалось, открывал двери к самой судьбе."
def get_novellas_options_g4f(text: str):
    query = (
        "Ненужно лишних слов таких как 'Конечно! Вот три варианта продолжения вашей новеллы', 'обращайтесь если нужно что то добавить' и т.д, отвечай строго"
        "Напиши мне продолжение новеллы в 3-х вариантах (Вариант X: ), каждый вариет должен быть 2 или 3 строки\n"
        f"Вот содержание сомой новеллы: {text}"
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user", 
                "content": query
            }
        ],
    )

    response_text = response.choices[0].message.content
    parts = response_text.split("\n\n")

    result = [
        {
            "first": parts[0][11:],
        },
        {
            "second": parts[1][11:],
        },
        {
            "third": parts[2][11:],
        }
    ]

    return result


def get_novella_title(text: str):
    query = (
        "Ненужно лишних слов напиши только ответ"
        f"Напиши заголовок этой новеллы: {text}"
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user", 
                "content": query
            }
        ],
    )

    response_text = response.choices[0].message.content

    return response_text


def get_options_the_end_novella(text: str):
    query = (
        "Ненужно лишних слов таких как 'Конечно! Вот три варианта продолжения вашей новеллы', 'обращайтесь если нужно что то добавить' и т.д, отвечай строго"
        "Закончи новеллу в 3-х вариантах (Вариант X: ), каждый вариет должен быть 2 или 3 строки\n"
        f"Вот содержание сомой новеллы: {text}"
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user", 
                "content": query
            }
        ],
    )

    response_text = response.choices[0].message.content
    parts = response_text.split("\n\n")

    result = [
        {
            "first": parts[0][11:],
        },
        {
            "second": parts[1][11:],
        },
        {
            "third": parts[2][11:],
        }
    ]

    return result