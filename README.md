# KeyStroke App

This application records keystrokes with a relative timestamp. 
Keystroke events are pushed from the browser to Apache Kafka via an express server.
Keystrokes are currently consumed by a python script which writes the events to a csv file for eventual analytics.
### Goals: 
- Initial analytics using python/R
- Apache Spark integration for live analytics
- Session based identification to simultaneous data aggregation for multiple users
- Web hosting
- Create a consumer to write events to persistent db

## Instructions

[fill]

## Changelog
### 1/7/2024
- Uploaded each component to github
- Kafka to be run from an existing docker image
- Application works with each service running locally
- Dockerized consumer functions properly in docker container
- Remaining issues with dockerizing express server relate to (per my current understanding) configuration of listener and advertised listener settings within Kafka
