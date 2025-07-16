# YouApp Backend (NestJS 🚀)
![Node.js](https://img.shields.io/badge/Node.js-16.x-brightgreen)
![NestJS](https://img.shields.io/badge/NestJS-DDD-red)
![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-green)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![RabbitMQ](https://img.shields.io/badge/Messaging-RabbitMQ-orange)
![Redis](https://img.shields.io/badge/Cache-Redis-blueviolet)

Tech stack:
- NestJS
- MongoDB
- Docker & Docker Compose
- JWT for auth
- DTOs, zod validator pipeline
- RabbitMQ for chat notifications
- Unit tests (Jest)
- Redis

This project was originally built under a constrained timeline. If I were to rewrite this in Rust, I'd lean on axum, lapin, and bb8 to achieve better runtime perf, safety, and deployment size.

## 📦 Setup
1. Clone & install
   
   ```bash
   git clone https://github.com/Xenn-00/you-app.git
   cd you-app
   cp .env.example .env
   ```
   I prefer you use pnpm cause it's disk-efficient
   
   ```bash
   pnpm install
   ```
   but if you are using `npm` or `yarn` is also okay (maybe you need tweak it yourself)
3. Setup HMAC
   
   ```env
   JWT_SECRET=your_super_strong_secret_here
   ```
4. Start service via Docker:

   ```bash
   docker compose up --build
   ```

NOTE: To run swagger make sure you're all set, then -> http://localhost:3000/api-docs

## ⚙️ API Endpoints

- `POST /api/register`

  Register with `username`, `email`, `password`, and `confirm_password`

- `POST /api/login`

  Receive access (JWT)

- `POST /api/createProfile`

  Auth + payload: display name, birthdate, gender, height, weight, profile picture url, interest (array), horoscope/zodiac auto-calculated.

- `GET /api/getProfile`

  Get own profile details

- `PATCH /api/updateProfile`

  Update profile fields: display name, height, weight, and profile picture url

- `GET /api/viewMessages?userId=<userId>`

  Get chat history between current user and `<userId>`

- `POST /api/sendMessage`

  Payload `{"receiverId": <userId target>, "content": "your text message"}` -> persists message, publishes via RabbitMQ, notifies recipient via socket.io

## 📊 Database Schema
-  `User`: username, email, password, createdAt
-  `Profile`: userId, displayName, gender, birthDate, horoscope, zodiac, height, weight, interests, profilePictureUrl
-  `Message`: senderId, receiverId, content, isRead, timestamp

## 🔄 Data Flow & Patterns

- DTOs + class-validator for proper data validation

- Modular services/controllers per feature (auth, profile, chat)

- JWT Guard to secure protected routes

- RabbitMQ pub/sub: message.sent channel; each chat publish triggers notification event via socket.io using NestJS @WebSocketGateway() decorator

- Chat uses object-oriented structure & queue data flow — great example of queue, stack, array usage, plus maybe hash-map for caching user sess

## 🧪 Tests 
- Unit tests for services and controller
- Run with:
  ```bash
  pnpm test
  ```

## 🐳 Docker

- Dockerfile: multi-stage build for dev + prod

- docker-compose.yml:
  - backend (NestJS API)
  - mongodb
  - rabbitmq
  - redis
  
