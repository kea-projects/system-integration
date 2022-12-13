# Reflections on process

This document should contain the following:

"Write down your general observations during the semester."


# <Something that went well?>

# <Something that did not?>

# Azure Deployment
Azure allows us to deploy our entire dockerfile very conveniently, however,
it proved to be very difficult to actually implement.

The issues began with our two databases. Only one was allowed to run at any one
time. There was not error indication anywhere as to why one was crashing, as
azure does not store logs of terminated containers.

A temporary fix for this was to host one db instance on azure, at the cost of 
20 usd per month (This was the cheapest option we could select).

Once that was resolved, the next issue was that 4 of our services where 
being terminated for seemingly no reason. By sheer luck, on one of the times 
when we attempted to check the logs we discovered an error: Port 8080 in use.

The reason this was a lucky find is that azure does not keep application logs.
So we managed to catch the error in the last second before the container was
terminated. 

We had designed our system to all expose to the docker network on the same port
docker compose, through docker swarm, manages these ports in the docker network
to route traffic as desired. However, azure does not, apparently, use swarm.
This ultimately meant that the ports exposed to the internal docker network 
were forwarded to the deployment host, and overlapped each other leading to 
failures.

This was easy enough to fix once it was discovered. We allocated a unique port
to each service, and updated our gateway accordingly.

At this point, everything seemed to be running, however, after around 2 minutes
the rabbitmq service would shut down, taking the rest of the system down with
it.

This, as it turns out, is because of our health-check procedures we had defined
in the docker compose. Running these locally, those commands are executed 
inside the containers themselves, and either return 0 when successful or any 
number when not. However, once deployed on azure, they are ran in a simulated
shell, and not within our own containers. This was a big issue, as we are
relying on binaries that exist within our containers for the health-checks to
pass. But as the binaries are not found in azure's simulated shell, they fail.
And once a service reports that it failing, any service that has the depends_on
directive for it, will be taken offline too.

Once again, we could not find any information about this when inspecting the 
state of the containers, and was discovered by accident almost, as once we 
entered once of our containers for an unrelated reason, we saw that a binary
that should have been there was absent.

Finally, once all the above issues were resolved, we were able to successfully
deploy our application on azure. 

# Docker compose
We chose to dockerize our services from the beginning as we wanted to have
flexibility to be able to deploy each service independently. This however led
to issues with managing multiple Dockerfile and when anyone needed to test
their code with another service they would have to use multiple terminals just
to have everything running.

The solution was to create a docker compose configuration. It allows us to
easily create and build multiple services at once and this sped up development
by a lot.

The only downside to this system was that there would have to be early 
configuration on the gateway to connect it to the various services, where 
we would normally have done that later on in the development cycle.

# SFTP Server
For the FTP server we decided that we wanted a secure implementation that had
some form of authorization. We settled on using an SFTP docker container.

We had issues with the implementation of this as our Nginx gateway was not able
to redirects the traffic due to it not being regular Http traffic.
This was resolved rather quickly thanks to the discovery of the 'stream'
protocol that allowed us to redirect traffic that Nginx does not inherently
understand.

Another place where issues arose was once we deployed it to Azure. For reasons
we never really understood, Azure has a different 'command' behavior in docker
compose than the ones on our machines. This mean that what we originally used,
a command to initialize our user in the image, was no longer usable. Thankfully
we found a workaround for creating our user within the image with a config file
that could be passed during the creation of the image that allowed us to keep
the same behavior with minor modifications.
