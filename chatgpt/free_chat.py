from ast import main
import asyncio
from typing import Optional
from g4f.client import Client

client = Client()

def get_novellas_options_g4f(text: str):
    query = (
        "Ненужно лишних слов таких как 'Конечно! Вот три варианта продолжения вашей новеллы', 'обращайтесь если нужно что то добавить' и т.д, отвечай строго"
        "Напиши мне продолжение новеллы. сперва краткая история которое случилось от моего мини историей(я его напишу снизу ) одним абзацом, а потом выбор следующего шага в 3-х вариантах (Вариант X: ), каждый вариант должен быть 2 или 3 строки. между вариантами обязательно оставляй по 2 отступа\n"
        f"Вот содержание самой новеллы: {text}"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "user", 
                "content": query
            }
        ],
    )
    print('response', response.choices[0].message.content)
    response_text = response.choices[0].message.content
    parts = response_text.split("\n\n")

    result = [
        {
            "short_story": parts[0],
        },
        {
            "first": parts[1][11:],
        },
        {
            "second": parts[2][11:],
        },
        {
            "third": parts[3][11:],
        }
    ]
    print('result', result)
    return result


def get_novella_title(text: str):
    query = (
        "Ненужно лишних слов напиши только ответ"
        f"Напиши заголовок этой новеллы: {text}"
    )

    response = client.chat.completions.create(
        model="gpt-4",
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
        "Напиши финал новеллы\n"
        f"Вот содержание сомой новеллы: {text}"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "user", 
                "content": query
            }
        ],
    )

    return response.choices[0].message.content