# Reflections on process

This document should contain the following:

"Write down your general observations during the semester."

# Azure Deployment


# Docker compose


# <Something that went well?>

# <Something that did not?>

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
