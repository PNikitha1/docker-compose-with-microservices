# PG Management System -- Microservices Architecture

A complete **PG (Paying Guest) Management System** built using **Spring
Boot Microservices**, **Eureka Service Discovery**, **Spring Cloud API
Gateway**, and a **React (Vite) Frontend**, fully containerized using
**Docker** and orchestrated with **Docker Compose**.

## Project Architecture

    /project-root
    │── docker-compose.yml
    │── /backend
    │    ├── Eureka/
    │    ├── Api-Gateway/
    │    ├── Usermicroservice/
    │    ├── Tenantsmicroservice/
    │    ├── Ticketssmicroservice/
    │    ├── Roomsmicroservice/
    │    └── Noticessmicroservice/
    │
    └── /frontend

## Tech Stack

### Backend -- Spring Boot

-   Eureka Discovery Server
-   Spring Cloud Gateway
-   User Microservice
-   Tenants Microservice
-   Rooms Microservice
-   Notices Microservice
-   Tickets Microservice

### Frontend

-   React + Vite

### Infrastructure

-   Docker
-   Docker Compose
-   Java 17+
-   Node.js

## Running the Entire System Using Docker Compose

### Start all services

``` bash
docker compose up --build
```

### Run without rebuilding

``` bash
docker compose up
```

### Stop all services

``` bash
docker compose down
```

## Service URLs

  Service            Port   URL
  ------------------ ------ -----------------------
  Eureka Dashboard   8761   http://localhost:8761
  API Gateway        8086   http://localhost:8086
  User Service       8085   http://localhost:8085
  Tenants Service    8082   http://localhost:8082
  Tickets Service    8084   http://localhost:8084
  Rooms Service      8083   http://localhost:8083
  Notices Service    8081   http://localhost:8081
  Frontend           5173   http://localhost:5173

## H2 Console Access

To enable remote access inside Docker:

    spring.h2.console.enabled=true
    spring.h2.console.settings.web-allow-others=true

Access:

    http://localhost:<service-port>/h2-console

## License

MIT License
