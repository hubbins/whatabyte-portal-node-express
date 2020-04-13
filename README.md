https://auth0.com/blog/create-a-simple-and-secure-node-express-app/

Add an entry to your hosts file:
`127.0.0.1 myapp.example`

The .env file (not checked in) should contain the following (replace client id and secret from the console):

```
AUTH0_DOMAIN=mstar-sean-test.auth0.com
AUTH0_CLIENT_ID=F6lYv7QQR0uGy_REDACTED
AUTH0_CLIENT_SECRET=igpczjxQjF5RTYtXdTjX9H_REDACTED

API_AUDIENCE="https://api-testing.morningstar.com/"

SESSION_SECRET=sadfasfhafa

DOMAIN=myapp.example
AUTH0_CALLBACK_URL="http://myapp.example:3000/callback"
```
