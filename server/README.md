# BookMyVenue - Backend Server

Backend service for **BookMyVenue**, built with **Spring Boot**, **Java 21**, and **Maven**.
The project uses a **PostgreSQL** database running inside Docker for local development.

---

# Tech Stack

* **Language:** Java 21
* **Framework:** Spring Boot 3.5.14
* **Build Tool:** Apache Maven
* **Database:** PostgreSQL
* **Containerization:** Docker & Docker Compose

---

# Prerequisites

Before running the project, make sure the following are installed on your machine.

## 1. Java 21

Check installed version:

```bash
java -version
```

---

## 2. Docker & Docker Compose

Check installation:

```bash
docker --version
docker compose version
```

---

## 3. Ensure Port 5432 is Free

If PostgreSQL is already running locally, stop it before starting Docker:

```bash
sudo systemctl stop postgresql
```

---

# Running the Project Locally

## Step 1: Configure Environment Variables

Inside the `server/` directory, create a local `.env` file from the example template:

```bash
cp .env.example .env
```

Open the `.env` file and verify the values:

```env
DB_USERNAME=postgres
DB_PASSWORD=your password
DB_NAME=bookmyvenue_db
```



---

## Step 2: Start PostgreSQL with Docker

From inside the `server/` directory, start the database container:

```bash
docker compose up -d
```

Verify the container is running:

```bash
docker ps
```

---

## Step 3: Run the Spring Boot Application

You can either:

* Click the **Run/Play** button in your IDE (IntelliJ IDEA / VS Code)

OR

Run the Maven wrapper command:

```bash
./mvnw spring-boot:run
```

When you see the following log:

```text
Started BookMyVenueApplication
```

the backend server is successfully running.

---

# Stopping the Docker Container

To stop the PostgreSQL container:

```bash
docker compose down
```

> Your database data will remain safe because Docker volumes are persisted.

---

# Project Structure

```text
server/
├── src/
├── docker-compose.yml
├── .env.example
├── pom.xml
└── mvnw
```

---

# Notes

* Ensure Docker Desktop/service is running before starting the project.
* Use Java 21 for compatibility.
* PostgreSQL runs inside Docker to keep local setup consistent across all developers.

---
