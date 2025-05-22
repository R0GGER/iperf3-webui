FROM python:3

WORKDIR /app

RUN apt-get update && apt-get install -y iperf3

COPY images ./images
COPY static ./static
COPY templates ./templates
COPY app.py .

COPY requirements.txt .

RUN pip install --requirement requirements.txt

EXPOSE 5000
CMD ["python3", "app.py"]
