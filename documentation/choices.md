# Choices
This document should contain the following:

"Some of the choices you have made along the way and your perceived advantages
and disadvantages of them. Keywords: Cost-saving, DX, ease of integration,
reduction of complexity, scalability."

# Nginx
We have decided to use Nginx as it would allow us to create a variety of
services in the backend while only needing to expose one external entity.

This also allows us to make substantial changes to the backend without needing
to ever change how our services are reached externally, as Nginx can redirect
to what ever internal service we decide to implement. This will make it much
easier for our integration team to work with, as we do not have many unique
endpoints that must be updated every time we update the services.

The downside of Nginx however, is the added complexity, as every implementation
needs to first run locally, and then a way to make it work through Nginx has
to be found.

# Docker
We decided to run as many internal services in docker as possible as this
ensures that if it runs on any one developer's machine, it will run on all.
It also makes it easier to deploy, as every variable needed to run each service
is stored within it's own dockerfile.

Additionally, Docker provides an isolation layer from our services and the
underlying infrastructure. This means that if one of our docker containers is
compromised, this does not automatically give any attacker access to the rest
of our system.

Docker also helps with scalability, as we can deploy multiple instances of our
services should we need to, and all we have to do is update the Nginx
configuration to point to the extra services and load-balance them.

The downside to using Docker though is the added complexity of the system as a
whole as all developers then need to be familiar with how Docker works.

# SFTP
We wanted to include FTP into our project, but we felt that the lack of
authentication would be a large problem with a hosted server. We therefore
decided to use SFTP as it would allow only those that posses the correct
username and password to use our server.

This allows anyone who wants to integrate with our system, and that has the
credentials for it, to use the ftp as they need to, without worrying about data
being leaked.

# Picture Storage
We decided to use Azure Storage Accounts to store images. This allows us to decouple
access to images from our actual system, since we can provide URLs that lead directly to Azure.

This also reduces the strain on the host machine(s), since they no longer require
the disk space and performance needed to store and serve files.

This increases the potential cost of hosting the system, but it can also reduce it since the
host machines can be optimized towards just hosting the services.

# CDN
We have chosen [Sirv](https://sirv.com/) as our CDN. This was decided due to its ease of integration,
speed of development, previous experience with it, and its generous free plan.

# Email Service
The email service is deployed as a serverless function on Azure using Azure functions.
This is due to the email service not needing to be online at all times.

For the actual email sending we have chosen Sendgrid due to its ease of integration,
attractive pricing, and previous team experience with it. Thanks to using Sendgrid
were able to swiftly implement the email sending functionality and focus on more
complex tasks.

# User-Service
We decided to implement some core application behavior as an independent
service that would be callable by any other service via rabbitmq. This allows
us to separate API logic that is exposed directly to the Nginx gateway from
internal logic.

It also allows us to only define behavior in one service, and have everyone
else use that service for that specific behavior. One example of this are
tokens.

Any service that needs a token generated or validated, can invoke an RPC like
call to the user-service, and receive a reply directly. The advantage of doing
these kinds of calls over RabbitMQ is that it cleverly keeps actions in the
queue until they get acknowledged. This means that even if a connection is
dropped, or a packet is lost, the action will still be guaranteed to complete.

Another benefit is that this allows us to centralize all logic relating to
users, improving the development experience. Anyone that needs user data, or 
behavior, can request if from this service. And anyone that wants to change any
user data must do the same. This allows for a very nice separation of concerns 
where one service is responsible for one action.

One downside to this system however, is the complexity of integration, as
every service that wishes to interact with the user-service, now needs to
communicate with RabbitMQ, and we found this to be rather complex. However,
as rabbitmq is the broker, this allows the user-service and RabbitMQ to be
deployed anywhere. Services ultimately only need to know where rabbitmq is, and
RabbitMQ knows where all the other services are located.

# RSS feed
While RSS is a rather simple feature, there is many ways of going around
how the XML data should be parsed and handled.
We wanted to keep the application complexity low and fast to develop,
so we opted for a third-party library that handles the RSS logic,
and then exposed the data through Express REST endpoints.

# Wishes Service Persistence Layer
We have decided to use PostgreSQL database for the wishes service for its built-in
support of UUID as a datatype, extensive documentation and previous experience with
deploying Postgres databases.

# RabbitMQ
We chose to implement RabbitMQ as we had originally thought to make the system
run with asynchronous calls to various services, allowing for multiple actions
to be executed at once.

Once we started to implement it however, we realized that what we had in mind
was simply not possible, as our API endpoints required a response to return to
the users. This make us pivot to using the RPC functionality that RabbitMQ 
provides. While this was initially hard to implement. It made the developer
experience much better, as developers did not need to know how to do behavior
unrelated to their own software. For example to validate a token we do an RPC
call to the user-service. We do not need to expose user data, token secrets or
any other variables to the API directly, instead it is all stored on the 
user-service.

This also means that we eliminated a lot of potential code repetition.
