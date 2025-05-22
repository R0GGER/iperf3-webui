FROM python:3

WORKDIR /app

RUN apt-get update && apt-get install -y iperf3

COPY static ./static
COPY templates ./templates
COPY app.py .

RUN --mount=type=bind,source=requirements.txt,target=/tmp/requirements.txt \
    pip install --requirement /tmp/requirements.txt

EXPOSE 5000

ENTRYPOINT python3 /app/app.py
