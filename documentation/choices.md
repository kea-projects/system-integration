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
to what ever internal service we decide to implement.

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

The downside to using Docker though is the added complexity of the isolation
layers, making it rather difficult initially to have the containers talk to one
another.

# SFTP
We wanted to include FTP into our project, but we felt that the lack of
authentication would be a large problem with a hosted server. We therefore
decided to use SFTP as it would allow only those that posses the correct
username and password to use our server.


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
users. Anyone that needs user data, or behavior, can request if from this
service. And anyone that wants to change any user data must do the same.
This allows for a very nice separation of concerns where one service is
responsible for one action.

One downside to this system however, is the complexity of integration, as
every service that wishes to interact with the user-service, now needs to
communicate with RabbitMQ, and we found this to be rather complex. However,
as rabbitmq is the broker, this allows the user-service and RabbitMQ to be
deployed anywhere. Services ultimately only need to know where rabbitmq is, and
RabbitMQ knows where all the other services are located.
