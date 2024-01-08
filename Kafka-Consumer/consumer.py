import sys
import threading
from confluent_kafka import Consumer, KafkaError, KafkaException
import json

conf = {
    'bootstrap.servers': "localhost:9092",
    'group.id': "1",
    'auto.offset.reset': 'latest'
}

consumer = Consumer(conf)

def consume(consumer, topics):
    try:
        consumer.subscribe(topics)
        # use this as a way to stop the loop
        t = threading.currentThread()
        while getattr(t, "run", True):
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # End of partition event
                    sys.stderr.write('%% %s [%d] reached end at offset %d\n' %
                                     (msg.topic(), msg.partition(), msg.offset()))
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                #key = msg.key().decode("utf-8")
                data = msg.value().decode("utf-8")
                print(data)
                try:
                    value = json.loads(data)
                    print(value["key"])
                    with open('data.csv', 'a') as f:
                        f.write(value["key"] + '\n')
                except:
                    print('this message is not in the correct form to be published to the csv. \nDid this message '
                          'come from the webapp?')
    finally:
        # Close down consumer to commit final offsets.
        consumer.close()

thread = threading.Thread(target=consume,
                          args=(consumer, ["topic_one"]))
thread.start()
