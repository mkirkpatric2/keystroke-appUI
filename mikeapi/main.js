const express = require('express');
const { Kafka, logLevel } = require('kafkajs');
const app = express();
app.use(express.json())
const port = 8888;

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.INFO
  })

const producer = kafka.producer()

app.get('/', (req, res) => {
    res.json({'key': 'value'})
})

app.post('/post', async (req, res) => {
    const run = async () => {
        console.log(req.body)
        // Producing
        await producer.connect()
        await producer.send({
          topic: 'topic_one',
          messages: [
            {value: JSON.stringify(req.body)},
          ],
        })}

    await run()
    res.json({'key':'posted'})}
    
    
)

app.listen(port, () => {console.log(`listening on port ${port}`)}); 