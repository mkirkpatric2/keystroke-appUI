FROM python:latest
WORKDIR /app
COPY consumer.py /app
RUN pip install confluent_kafka

ENTRYPOINT ["python", "consumer.py"]