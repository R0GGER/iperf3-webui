FROM python:3

WORKDIR /app

RUN apt-get update && apt-get install -y iperf3

COPY images ./images
COPY static ./static
COPY templates ./templates
COPY app.py .

COPY requirements.txt .
COPY env.yaml .


RUN pip install --requirement requirements.txt

ENV PORT=5000
EXPOSE ${PORT}
CMD gunicorn --bind 0.0.0.0:${PORT} --workers 2 --timeout 120 app:app
