# Email service - an Azure serverless function

## Setup in Azure

You will need an index.js with the actual logic, and a package.json defining the dependency of a Sendgrid library.

You will also need two application settings:
- `SENDGRID_API_KEY`=your sendgrid api key
- `SENDGRID_FROM_DOMAIN`=https://docs.sendgrid.com/ui/sending-email/sender-verification

Create the function in azure, replace the index.js, add the package.json (for example via the app service editor). Run npm install through the integrated terminal, and it should all be ready to go.


### The file structure
<img width="382" alt="image" src="https://user-images.githubusercontent.com/22862227/203440816-797d745d-3a3a-43b7-bbf5-80622fb3ab30.png">

### The integrated terminal within app service editor
<img width="169" alt="image" src="https://user-images.githubusercontent.com/22862227/203440942-6dc582ff-3027-46f2-b960-463214b8ddfe.png">

## How to call it

Make a POST request to your function URL with example body of
```json
{
    "invitee": "user@gmail.com",
    "invited": "user2@gmail.com"
}
```

The invited email should get an email that looks something like this
![image](https://user-images.githubusercontent.com/22862227/203444264-33472c3b-9781-4bbb-96dc-c25767a594fe.png)

In our system the call is made within the friend path application as a result of a POST `friend/invite` request