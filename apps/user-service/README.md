# Service description

This service exists to serve two purposes:
* Be the service responsible for all CRUD operations of users
    * This includes all forms of validation
* Be the service that any other service queries for user data
    * This is intended to happen via the RabbitMq Queue we have

WiP