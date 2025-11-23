
# PG Owner Portal — Microservices & React (Monorepo)

A production-ready PG (Paying Guest) management system built with **Spring Boot microservices**, **Spring Cloud Gateway**, **Eureka Service Discovery**, **JWT-based security**, and a **React + Redux Toolkit** frontend.

> Manage rooms, tenants, notices, and maintenance tickets with auth, protected routes, server-side search, CSV export, and clean UI.

---

## 🧭 Project Overview

### Backend (Java, Spring Boot)
- **API Gateway** (`api-gateway`, port **8086**) — Single ingress, CORS, routing, and timeouts.
- **Service Discovery** (`eureka-server`, port **8761**) — Registers all microservices.
- **User Microservice** (`usermicroservice`) — Authentication (`/api/auth/register`, `/api/auth/login`) with JWT filter.
- **Notices Microservice** (`noticessmicroservice`) — CRUD notices (`/notices`).
- **Rooms Microservice** (`roomsmicroservice`) — CRUD rooms + allocate (`/rooms`).
- **Tenants Microservice** (`tenantsmicroservice`) — CRUD tenants + CSV export (`/tenants`, `/tenants/export`).
- **Tickets Microservice** (`ticketssmicroservice`) — CRUD tickets + status patch (`/tickets`).

### Frontend (React)
- **Routes**: Dashboard, Rooms, Tenants, Notices, Raise Ticket, Login, Register.
- **State**: Redux Toolkit slices for `auth`, `rooms`, `tenants`, `notices`, `tickets`.
- **HTTP**: Axios instances per slice with token interceptor.
- **Security**: Route guard (`RequireAuth`) + guarded links/actions.
- **UX**: Fallback data when backend is empty/unavailable.

---

## 🔧 Tech Stack

**Backend**: Spring Boot, Spring Security, Spring Cloud Gateway, Spring Cloud Netflix Eureka, JPA/Hibernate, H2/MySQL (dev/prod), JWT

**Frontend**: React, React Router v6, Redux Toolkit, Axios, Formik + Yup (auth/rooms optional), Vite/CRA

---

## 📁 Directory Structure (example)

```
pg-portal/
  backend/
    api-gateway/
    eureka-server/
    usermicroservice/
    noticessmicroservice/
    roomsmicroservice/
    tenantsmicroservice/
    ticketssmicroservice/
  frontend/
    src/
      store/
        auth/
          authSlice.js
        rooms/
          roomSlice.js
        tenants/
          tenantSlice.js
        notices/
          noticeSlice.js
        tickets/
          ticketSlice.js
        store.js
      components/
        dashboard/
          Dashboard.jsx
        rooms/
          Rooms.jsx
        tenants/
          Tenants.jsx
        notices/
          Notices.jsx
        tickets/
          TicketRaise.jsx
        auth/
          RequireAuth.jsx
          Login.jsx
          Register.jsx
      
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21+**
- **Node.js 18+** and **npm/yarn**
- Optional: Docker (if containerizing)

### 1) Start Eureka Server (Service Discovery)
```bash
cd eureka-server
./mvnw spring-boot:run
# Eureka UI: http://localhost:8761
```

### 2) Start Microservices
Ensure each microservice has:
```yaml
spring:
  application:
    name: <service-id> # e.g., usermicroservice, noticessmicroservice

eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://localhost:8761/eureka
  instance:
    prefer-ip-address: true
```
Run each:
```bash
cd usermicroservice && ./mvnw spring-boot:run
cd noticessmicroservice && ./mvnw spring-boot:run
cd roomsmicroservice && ./mvnw spring-boot:run
cd tenantsmicroservice && ./mvnw spring-boot:run
cd ticketssmicroservice && ./mvnw spring-boot:run
```

### 3) Start API Gateway (port 8086)
```bash
cd api-gateway
./mvnw spring-boot:run
# Gateway: http://localhost:8086
```

#### Gateway `application.yml` (key sections)
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: users-service
          uri: lb://usermicroservice
          predicates:
            - Path=/usermicroservice/**
          filters:
            - StripPrefix=1
        - id: notices-service
          uri: lb://noticessmicroservice
          predicates:
            - Path=/noticessmicroservice/**
          filters:
            - StripPrefix=1
        - id: rooms-service
          uri: lb://roomsmicroservice
          predicates:
            - Path=/roomsmicroservice/**
          filters:
            - StripPrefix=1
        - id: tenants-service
          uri: lb://tenantsmicroservice
          predicates:
            - Path=/tenantsmicroservice/**
          filters:
            - StripPrefix=1
        - id: tickets-service
          uri: lb://ticketssmicroservice
          predicates:
            - Path=/ticketssmicroservice/**
          filters:
            - StripPrefix=1
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:5173"
              - "http://localhost:3000"
            allowedMethods: [GET, POST, PUT, DELETE, OPTIONS, PATCH]
            allowedHeaders: ["*"]
            allowCredentials: true
      httpclient:
        connect-timeout: 5000
        response-timeout: 10000ms
server:
  port: 8086
```

> **CORS Rule**: Configure CORS **only in Gateway**. Remove CORS beans/annotations from microservices to avoid duplicate `Access-Control-Allow-Origin` headers.

### 4) Start Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server: http://localhost:5173
```

If using CRA:
```bash
npm start
# http://localhost:3000
```

---

## 🔐 Security & Auth Flow

- Public endpoints: `/usermicroservice/api/auth/**` (register, login)
- After login, the frontend stores `token` in `localStorage`.
- Axios interceptors attach `Authorization: Bearer <token>` to requests.
- Protected routes use `RequireAuth` to redirect unauthenticated users to `/login`.
- **JWT filter** should skip public paths (e.g., `/api/auth/**`) and only authenticate when `Authorization` header is present.

---

## 🧩 Frontend Slices & Key Files

- `store/auth/authSlice.js` — login, register, logout, token-only storage.
- `store/notices/noticeSlice.js` — list/create/update with fallback mock if backend empty/unavailable.
- `store/rooms/roomSlice.js` — list/create/update/allocate/delete with server-side search and fallback mock.
- `store/tickets/ticketSlice.js` — list/create/status-patch/delete.
- `store/tenants/tenantSlice.js` — list/create/update/delete/export CSV; generates `tenantId` if not provided.
- `components/auth/RequireAuth.jsx` — wraps protected routes.
- `components/dashboard/Dashboard.jsx` — dynamic header (Login/Register vs Logout) with guarded links.

---

## 🌐 Gateway Paths (from Frontend)

- **Auth**: `http://localhost:8086/usermicroservice/api/auth/register|login`
- **Notices**: `http://localhost:8086/noticessmicroservice/notices`
- **Rooms**: `http://localhost:8086/roomsmicroservice/rooms`
- **Tenants**: `http://localhost:8086/tenantsmicroservice/tenants`
- **Tickets**: `http://localhost:8086/ticketssmicroservice/tickets`

With `StripPrefix=1`, Gateway forwards `/SERVICE/**` → internal `/**` on the respective service.

---

## 🛠️ Sample Requests (via Gateway)

### Login
```bash
curl -X POST http://localhost:8086/usermicroservice/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"owner@example.com","password":"secret"}'
```

### Create Notice
```bash
curl -X POST http://localhost:8086/noticessmicroservice/notices \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' \
  -d '{"noticeId":"N123","title":"Rent due by 5th","date":"2025-11-20T00:00:00Z"}'
```

### Create Room
```bash
curl -X POST http://localhost:8086/roomsmicroservice/rooms \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' \
  -d '{"name":"A3","type":"3-sharing","capacity":3,"occupied":0,"price":5500}'
```

### Allocate Room
```bash
curl -X POST http://localhost:8086/roomsmicroservice/rooms/1/allocate \
  -H 'Authorization: Bearer <token>'
```

### Create Tenant
```bash
curl -X POST http://localhost:8086/tenantsmicroservice/tenants \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' \
  -d '{"tenantId":"T001","name":"Rahul Sharma","phone":"9XXXXXXXX1","room":"A1","checkIn":"2025-11-01","due":0}'
```

### Export Tenants CSV
```bash
curl -L -X GET 'http://localhost:8086/tenantsmicroservice/tenants/export' \
  -H 'Authorization: Bearer <token>' --output tenants.csv
```

### Create Ticket
```bash
curl -X POST http://localhost:8086/ticketssmicroservice/tickets \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' \
  -d '{"title":"Water leakage","room":"A2","priority":"MEDIUM","description":"Near washbasin"}'
```

### Update Ticket Status
```bash
curl -X PATCH http://localhost:8086/ticketssmicroservice/tickets/1/status \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' \
  -d '{"status":"IN_PROGRESS"}'
```

---

## ⚙️ Configuration & Environment

Create `.env` (frontend) if needed:
```env
VITE_API_GATEWAY=http://localhost:8086
```
Update axios bases in slices to use `import.meta.env.VITE_API_GATEWAY`.

Backend ports (dev examples):
- Gateway: **8086**
- Eureka: **8761**
- Users: **8085** (if direct), but access via Gateway path `/usermicroservice/**`
- Notices/Rooms/Tenants/Tickets: choose distinct ports per service; access via Gateway.

---

## 🧪 Testing & Running

- Hit frontend at `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA).
- Register → Login → Dashboard → try Rooms/Tenants/Notices/Tickets.
- Verify Eureka shows each service as **UP** with reachable IP/port.

---

## 🩺 Troubleshooting

### CORS: Multiple `Access-Control-Allow-Origin` values
**Symptom**: Browser error: _header contains multiple values ..._
**Fix**: Configure CORS **only in Gateway**. Remove microservice `CorsConfigurationSource` beans or `@CrossOrigin`.

### Gateway Connect Timeout (Netty)
**Symptom**: `io.netty.channel.AbstractChannel$AnnotatedConnectException: Connection timed out ...`
**Fix**:
- Ensure microservice is running and reachable from Gateway host.
- Eureka must advertise a reachable IP/port (set `prefer-ip-address=true`).
- Confirm ports and firewall rules.

### 401 on Public Endpoints
**Symptom**: `/api/auth/register` returns 401.
**Fix**: JWT filter should **skip** `/api/auth/**`. Only authenticate when `Authorization` header exists; let Spring Security handle protected paths.

### UUID too long for column
**Symptom**: `NOTICE_ID VARCHAR(32)` rejects 36-char UUID with hyphens.
**Fix**: Use `uuid.replace(/-/g, '')` (32 chars) or increase column length to 36.

---

## 📜 License
MIT (or your preferred license). Add `LICENSE` file if required.

## 👤 Author
Built by Pallapothula Nikitha.

---

## 📣 Notes
- All endpoints should be consumed **via Gateway** in the frontend.
- Protect routes with `RequireAuth` and guard clicks to redirect unauthenticated users to `/login`.
- Slices include **fallback data** to keep UI responsive when backend is empty/unavailable during development.

