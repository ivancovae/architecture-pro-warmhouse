FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY config.env .

EXPOSE ${SERVER_PORT}

CMD uvicorn main:app "--host" "0.0.0.0" "--port" ${SERVER_PORT} "--env-file" "/app/config.env"