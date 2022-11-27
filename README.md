# System Integration Group Homework

## 1. Friend Pane

### Setup

- Use `cd friend-pane` to navigate to the project's directory.
- Run `npm install` to install the dependencies.
- Create a `.env` file with the in the [friend-pane](./friend-pane/) folder following the structure of the `.env-template` file.

### Running the project

- Run the `npm start` command.

  > Note: The users are stored in the [users.json](./friend-pane/users.json) file. Any of them can be used to access the system.

#### Docker Compose

Run `docker compose up --build` to run the project
Follow it up with

```
docker compose -f docker-compose.caddy.yml up --build
```

```sh
sudo cp configs/caddy/Caddyfile /var/lib/docker/volumes/caddy_config/_data/caddy/Caddyfile
```
and 

```sh
docker exec -w /configs/caddy system-integration-caddy-1 caddy reload
```

to reload the config of Caddy, and fully enable HTTPS.
Modify the `config/caddy/Caddyfile` to suit your needs

### Documentation

- In the [docs](./docs/) folder there is attached the Postman collection which contains all of the usable endpoints for the project, along with sample data for using them.
