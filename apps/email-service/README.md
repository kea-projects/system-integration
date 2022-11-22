# Email service - an Azure serverless function

You will need an index.js with the actual logic, and a package.json defining the dependency of a Sendgrid library.

You will also need two application settings:
- `SENDGRID_API_KEY`=your sendgrid api key
- `SENDGRID_FROM_DOMAIN`=https://docs.sendgrid.com/ui/sending-email/sender-verification

Create the function in azure, replace the index.js, add the package.json (for example via the app service editor). Run npm install through the integrated terminal, and it should all be ready to go.

Then you can make a POST request to your function with example body of
```json
{
    "invitee": "user@gmail.com",
    "invited": "user2@gmail.com"
}
```
## The file structure
<img width="382" alt="image" src="https://user-images.githubusercontent.com/22862227/203440816-797d745d-3a3a-43b7-bbf5-80622fb3ab30.png">

## The integrated terminal within app service editor
<img width="169" alt="image" src="https://user-images.githubusercontent.com/22862227/203440942-6dc582ff-3027-46f2-b960-463214b8ddfe.png">