# KeyStroke App

This application records keystrokes with a relative timestamp. 
Keystroke events are pushed from the browser to Apache Kafka via an express server.
Keystrokes are currently consumed by a python script which writes the events to a csv file for eventual analytics.

I worked on this application with my brother Jonathan (https://github.com/jkirk001). Jonathan did the vast majority of the UI work while I implemented everything else. 
### Goals: 
- Initial analytics using python/R
- Apache Spark integration for live analytics
- Session based identification to allow simultaneous data aggregation for multiple users
- Web hosting
- Create a consumer to write events to persistent db


## Requirements to run (1/7/2024) 
- Node 21
- Docker
- Python (If running locally)

## Instructions
NOTE: These instructions have been tested on Windows 10 Education 19045.3803 & 
1. Clone the repo into an empty folder & navigate your console to the root folder for the project.    
```[path]/keystroke-appUI/```

2. Get Kafka running  
This instance of Kafka uses Kafka running with KRaft, not zookeeper.   
```$ docker pull confluentinc/confluent-local:latest```    
We are not generating a unique cluster ID as this cluster will just run 1 broker locally.   
```$ docker run -p 9092:9092 -d --name kafka-kraft -e q1Sh-9_ISia_zwGINzRvyQ confluentinc/confluent-local```    


3. Add a Kafka topic     
To add a topic, we need to connect to the Docker container and issue commands from within.    
```$ docker exec -it kafka-kraft bash ```     
Add a topic. As the topic name is hardcoded within the rest of the application, ensure its name is 'topic_one'    
```$ kafka-topics --bootstrap-server localhost:9092 --topic topic_one --create```    
We are finished inside the docker container and can return to our local machine.    
``` ctrl+d ```

4. Run the Express api     
Navigate the console to the 'mikeapi' folder    
```$ cd mikeapi```    
Start the api    
```$ node main.js```    

5. Run the python consumer    
5a. Local method    
In a new console window (as the previous version will be occupied with the express server), navigate to 'Kafka-Consumer' folder    
```$ cd [path]/kestroke-appUI/Kafka-Consumer```    
Install the necessary dependency (whether locally or within a virtual environment)    
```$ pip install confluent_kafka```    
Run the python file    
```$ python consumer.py```    
5b. Docker method    
In a new console window (as the previous version will be occupied with the express server), navigate to 'Kafka-Consumer' folder    
```$ cd [path]/kestroke-appUI/Kafka-Consumer```    
Build the docker image    
```$ docker build -t kafka-consumer . ```    
Spin up a container on the 'host' network to allow communication with Kafka.    
```$ docker run --network host --name py-consumer kafka-consumer```    

7. Start the webserver    
In a final console window, navigate to the webapp folder    
```$ cd [path]/kestroke-appUI/MikeUI-main```
Install dependencies    
```$ npm i```    
Start it    
```$ npm start```    

9. Open and type!    
In a browser, navigate to localhost:8080
Begin typing!
As you type, your data will be written to a csv file in the folder with the consumer.py running. 

NOTE: If running a dockerized consumer, the results sometimes do not print to console. Nonetheless, the data does get recorded to the csv in the docker container. Instructions for accessing the file are below:     
```$ docker exec -it py-consumer bash```    
Ensure you are in the /app directory in the container.    
```$ cat data.csv```   
Your data should be printed to the console!




## Changelog
### 1/7/2024
- Uploaded each component to github
- Kafka to be run from an existing docker image
- Application works with each service running locally
- Dockerized consumer functions properly in docker container
- Remaining issues with dockerizing express server relate to (per my current understanding) configuration of listener and advertised listener settings within Kafka
