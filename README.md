# SpiceOil Backend

    This repository contains the source code for a simple e-commerce platform focused on selling spices and essential oils from Indonesia.

## REST API specification

- Production : <https://spiceoil-backend.mrhasansan.com/>
- Local : <http://localhost:3000>

## Products

| Endpoint           | HTTP     | Desctription              |
| ------------------ | -------- | ------------------------- |
| `/products`        | `GET`    | Get all products          |
| `/products/:id`    | `GET`    | Get one products by id    |
| `/products`        | `POST`   | add new products          |
| `/products`        | `DELETE` | delete all products       |
| `/products/:id`    | `DELETE` | delete one products by id |
| `/products/:id`    | `PUT`    | Update one products by id |
| `/products/seeded` | `PUT`    | seed many products        |

## Authentication

| Endpoint           | HTTP     | Desctription                    |
| ------------------ | -------- | ------------------------------- |
| `/users`           | `GET`    | Get all users                   |
| `/users/:username` | `GET`    | Get one user by username        |
| `/auth/register`   | `POST`   | Authenticated user registration |
| `/auth/signin`     | `POST`   | Authenticated user sign in      |
| `/auth/myprofile`  | `POST`   | get detail data users           |
| `/cart`            | `GET`    | get data cart by username       |
| `/cart/items`      | `POST`   | post data cart by username      |
| `/cart/items`      | `PUT`    | update data cart by username    |
| `/cart/items`      | `DELETE` | delete data cart by username    |

## Database Design/Schema/Entity Relationship Diagram (ERD)

# Getting Started

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000

# Prisma Setup
