FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false \
	POETRY_NO_INTERACTION=1

WORKDIR /app

# Instala dependências do sistema necessárias para compilar pacotes Python comuns
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential libpq-dev curl \
	&& rm -rf /var/lib/apt/lists/*

# Atualiza pip e instala o Poetry via pip (pinada à versão usada para gerar o lock)
RUN python -m pip install --upgrade pip setuptools wheel \
	&& python -m pip install --no-cache-dir "poetry==2.0.1"

# Copia arquivos de dependências primeiro para aproveitar o cache do Docker
COPY pyproject.toml poetry.lock* /app/
COPY README.md /app/

# Instala dependências do projeto (sem dependências de desenvolvimento por padrão)
# Aumentamos a verbosidade para ver o erro no build caso ele persista
RUN poetry --version
RUN poetry install --no-root

# Copia o resto do projeto
COPY . /app

EXPOSE 8000

# Executa o Gunicorn via Poetry
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:8000"]