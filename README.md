# AMPD - Device Savings Tracking API

An Express.js application for tracking and analyzing device energy savings data.

## Project Overview

AMPD is a backend API service that manages device information and tracks their energy savings metrics over time. At Ampd Energy, the company helps customers reduce their carbon footprint by replacing diesel generators with energy storage systems. The system measures energy input and output, and calculates the carbon savings for customers.

This project provides an API that supports a device savings visualization interface, allowing users to:
- Filter device savings data by date range
- View data with zooming capabilities (with maximum zoom level of 1 day)
- Retrieve device information
- Track and query device energy savings data
- View aggregated savings data over different time periods

The application uses Express.js with TypeScript, MySQL for data storage, and Redis for caching.

## Features

- RESTful API endpoints for device and savings data
- Database persistence with MySQL
- Caching with Redis
- Data validation using Zod
- Containerized environment with Docker
- CSV data seeding functionality

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL (MariaDB in Docker)
- **Caching**: Redis
- **Validation**: Zod
- **Logging**: Pino
- **Containerization**: Docker, DevContainers
- **Utilities**: dayjs, neat-csv

## Project Structure

```
ampd/
├── .devcontainer/            # Development container configuration
│   ├── devcontainer.json     # VS Code DevContainer settings
│   ├── docker-compose.yaml   # Development services configuration
│   └── Dockerfile            # Development container definition
├── assets/                   # Static assets
│   └── device-saving-mockup.png # UI mockup image
├── data/                     # CSV data for seeding
│   ├── device-saving.csv     # Device savings data
│   └── devices.csv           # Device information
├── src/                      # Source code
│   ├── controller/           # Request handlers
│   │   ├── devices.ts        # Device controller
│   │   └── savings.ts        # Savings controller
│   ├── middleware/           # Express middleware
│   │   └── index.ts          # Middleware setup
│   ├── model/                # Database models
│   │   ├── device-saving.ts  # Device savings model
│   │   └── device.ts         # Device model
│   ├── router/               # API routes
│   │   ├── device.ts         # Device routes
│   │   ├── health.ts         # Health check routes
│   │   ├── index.ts          # Route loader
│   │   └── savings.ts        # Savings routes
│   ├── schema/               # Data validation schemas
│   │   ├── device-saving.ts  # Device savings schema
│   │   └── device.ts         # Device schema
│   ├── scripts/              # Utility scripts
│   │   └── seed.ts           # Database seeding script
│   ├── service/              # External services
│   │   ├── mysql.ts          # MySQL connection service
│   │   └── redis.ts          # Redis connection service
│   ├── config.ts             # Application configuration
│   ├── logger.ts             # Logging setup
│   └── main.ts               # Application entry point
├── backend-junior.md         # Original project requirements
├── docker-compose.yaml       # Docker Compose configuration
├── Dockerfile                # Docker build instructions
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Project Origin

This project was initially created as a take-home coding exercise for a backend developer position. The original requirements included:

- Building a RESTful or GraphQL API to support a UI for visualizing device savings data
- Supporting date range filtering, zooming, and aggregation of data
- Using provided mock data for devices and their savings metrics
- Running in Mac OSX/Linux environments
- Using Node.js v18.19.0

The mockup UI and sample data were provided as part of the exercise requirements, and this implementation aims to fulfill those requirements with a scalable, maintainable architecture.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker and Docker Compose (for containerized setup)
- MySQL (for local development)
- Redis (for local development)

### Environment Setup

Create a `.env` file in the root directory with the following variables:  
**NOTE**: You can copy the `.env.example` file to `.env` and modify the values as needed.

```env
NODE_ENV=development
APP_PORT=3000
CORS_ORIGIN=http://localhost:3000

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=ampd
MYSQL_USER=root
MYSQL_PASSWORD=password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ampd.git
cd ampd
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

### Running the Application

#### Development Mode

Start the application in development mode with automatic reloading:

```bash
npm run dev:watch
# or
pnpm run dev:watch
```

Run the application in development mode without watching for changes:

```bash
npm run dev
# or
pnpm run dev
```

#### Production Mode

Build the application:

```bash
npm run build
# or
pnpm run build
```

Start the application:

```bash
npm start
# or
pnpm start
```

### Seeding the Database

To populate the database with initial data:

For development:
```bash
npm run seed:dev
# or
pnpm run seed:dev
```

For production (after building):
```bash
npm run seed
# or
pnpm run seed
```

### Using Docker

To run the entire application stack with Docker:

```bash
docker-compose up -d
```

This will start:
- The AMPD application
- A MariaDB database
- A Redis instance

### Using Development Containers (DevContainers)

This project includes DevContainer configuration, which provides a consistent, reproducible, and isolated development environment. DevContainers allow developers to work in a containerized environment that matches production.

#### Benefits of DevContainers

- **Consistent Development Environment**: Everyone on the team uses the same development environment with the same dependencies and tools.
- **Easy Onboarding**: New developers can start working with the project quickly without complicated setup steps.
- **Isolation**: The development environment is isolated from your local system, preventing conflicts with other projects.
- **Pre-configured Tools**: Essential development tools and VS Code extensions are automatically installed.

#### DevContainer Configuration

The project includes the following DevContainer configuration files:

- `.devcontainer/devcontainer.json`: Defines the VS Code integration and extensions
- `.devcontainer/docker-compose.yaml`: Configures the development services (app, MySQL, Redis)
- `.devcontainer/Dockerfile`: Specifies the development container image based on Node.js 18.19.0

#### Getting Started with DevContainers

1. Install [VS Code](https://code.visualstudio.com/) and the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
2. Clone the repository
3. Open the project in VS Code
4. When prompted, click "Reopen in Container" or use the command palette (F1) and select "Remote-Containers: Reopen in Container"
5. VS Code will build the container and set up the development environment
6. You can now run the application using the provided scripts without installing any dependencies locally

All necessary tools including Node.js 18.19.0, pnpm, MariaDB client, and Redis tools are pre-installed in the container.

## API Endpoints

### Health Check

- `GET /health` - Check API health status

### Devices

- `GET /devices` - Get all devices
- `GET /devices/:id` - Get a specific device by ID

### Savings

- `GET /savings/:deviceId` - Get savings data for a specific device
- `GET /savings/:deviceId/overall` - Get overall savings for a device

## Database Schema

### Devices Table

- `id` (INT, Primary Key) - Device identifier
- `name` (VARCHAR) - Device name
- `timezone` (VARCHAR) - Device timezone

### Device Savings Table

- `id` (INT, Primary Key) - Savings record identifier
- `device_id` (INT, Foreign Key) - Reference to devices table
- `carbon_saved` (DECIMAL) - Amount of carbon saved
- `fuel_saved` (DECIMAL) - Amount of fuel saved
- `timestamp` (DATETIME) - Server timestamp
- `device_timestamp` (DATETIME) - Device-reported timestamp

