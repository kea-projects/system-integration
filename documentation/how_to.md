# How to

This document should contain the following:

"Thorough how to guide for your own use that explains how you created each part of the system. Do it while you develop."

# CDN
Sign up & log in to [Sirv](https://sirv.com/). Upload the picture to the its storage, choose access options, filters etc, and obtain the resource url.
Add it to the nginx conf.d file at desired route and proxy it to the url, for example `/cdn/nice-logo-bro`.