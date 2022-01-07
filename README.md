# Mapesa

A platform that retrieves my financial reciepts from my SMS application on my android phone
It includes:
1. An Android application
3. A Node application
4. A Flask application

### Android Application

Retreives the receipts from the SMS Manager and sends a POST request to the node application

### [Node Application](https://github.com/ngareleo/mapesa-api)

Accepts my SMS messages, parses them and extracts relevant information and stores them in a MongoDB

The node application is also a server for a website which contains information about spending and cashflow

### Flask Application

Interacts with the mongoDB and recieves requests for resources.
