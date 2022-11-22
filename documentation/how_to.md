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
