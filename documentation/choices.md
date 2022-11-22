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
