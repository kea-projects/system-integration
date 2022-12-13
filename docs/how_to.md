# How to
This document should contain the following:

"Thorough how to guide for your own use that explains how you created each part of the system. Do it while you develop."

# Profile Picture Path + Bonus: Implement it
Since the beginning of the project we have been wondering what would be the best way to handle this.
We were torn between storing it locally on the host machine's file system versus uploading it to a third-party service.
In the end we have decided the better approach is to use a third-party system, for reasons mentioned in [the choices file](choices.md).
Since the way this system would be integrated with is by submitting a HTML web form, we have decided that the system should accept
`multipart/form-data` data.
The partner group also needs a way to access the data, which is done through URLs that point to the data hosted on the third party system.

The implementation process consisted of figuring out the best library for communicating with Azure, the third party system we chose, and then implementing it.
The next step was creating the endpoints needed to access this integration. The endpoint for uploading files has proven to be the most challenging part
but due to a large amount of code examples and guides existing for NodeJs it was completed swiftly as well.

# CDN
Sign up & log in to [Sirv](https://sirv.com/). Upload the picture to the its storage, choose access options, filters etc, and obtain the resource url.
Add it to the nginx conf.d file at desired route and proxy it to the url, for example `/cdn/nice-logo-bro`.



# Wishes Service:
Wishes Service is a simple application that feature a database connection, and a RPC over RabbitMQ connection. Implementation consisted of connecting to the database, defining the schema, and exposing it through the Express endpoints.
To increase security, the endpoints also require authentication which is performed by sending over the bearer token to user service for validation.

# SFTP Server
For our SFTP server we used a docker image called `atmoz/sftp`.

With this image all we have to provide is a user configuration file that
defines the username that we wish to create within the container, the password
that would be used to connect to it and the linux user id. We then could use
that user id to give the docker volume permissions that allowed our user to
write to the uploads folder through a startup script in the image.

# GraphQL API
TODO: Teodor

# Friend Path
TODO: Cris

# Auth Path
We implemented the Authorization path in python with fast-api. It does not
store any secrets of the system and is instead calling the user-service with
RPC calls to validate all data, including decoding and generating tokens.

A lot of effort was put into the fast-api components to be able to generate
highly accurate openapi docs with relevant example data with both sample 
queries and responses.

# RSS Feed
We have implemented the RSS feed with a library that handles the rss-specific logic, requiring us to only have to manage
persistence and access to the data. We didn't need authentication or access to any other service, so the final service is
just a simple API.

# User Service
The user service handles all data relating to users, users' invites and users'
Authorization.

The auth service is written in python and it defines all the user and invite 
models and all the functions related to them, as well as all security token
related behavior. It then spawns threads to listen for requests on predefined
topics within RabbitMQ, allowing other services to call any one of these at any
time.

Any other internal service that needs to check wether a user exits, if a token 
is valid, or to retrieve a list of invites can do so via rabbitmq to this 
service.

If any external entity wishes to have data on any of these they must go through
the relevant API's for them, and those API will contact the user-service via
RabbitMQ.

# Azure serverless function for email service
[Information is located here](./../apps/email-service/README.md)

# RabbitMQ
TODO: Cris
