# Project Name

An application for managing todos, notifications, and job queues with real-time updates and robust authentication.

## Features 🚀

### Core Features

- **Todo Management**: Create, update, and manage todos with easy-to-use endpoints.
- **Real-Time Notifications**: Users receive real-time notifications via WebSocket when certain actions occur.
- **Authentication & Permissions**: Secure access using the ZanzibarService for handling authentication and permission checks.

### Queue System

- **Scalable Queue Management**: Supports multiple job queues using the QueueService and QueueModule for distributed job processing.
- **Enhanced Logging and Error Handling**: Logs job data and queue names before processing and includes enhanced error handling with await in addJob.

## Testing and End-to-End (E2E) Setup

- **Comprehensive E2E Testing**: Includes test cases for real-time notifications and API endpoints using axios for HTTP requests and socket.io-client for WebSocket support.

## Setup Instructions 🛠

### Prerequisites

- **Node.js**: Version 20 or higher.
- **Docker**: Ensure Docker is installed for easy deployment.

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/project-name.git
    cd project-name
    ```

2. **Install Dependencies**:
    ```bash
    yarn install
    ```

3. **Set Up Environment Variables**:
    - Configure Redis and other service details in `.env`.

### Running Locally

1. **Start the App**:
    ```bash
    yarn start
    ```

2. **Run E2E Tests**:
    ```bash
    yarn test:e2e
    ```

3. **Docker Build and Run**:
    - Build and start the app with Docker for consistent environment setup:
    ```bash
    docker-compose up --build
    ```

## Configuration ⚙️

### Queue System Configuration

The queue system supports multiple dynamic queues, with configurable Redis host, port, and queue names via environment variables.

### Real-Time Notifications

The NotificationGateway is configured to emit notifications via WebSocket upon specific user interactions.

## Development Notes 📝

### Key Refactors

- **QueueService and QueueModule**: Refactored to handle multiple queues and dynamic Redis configurations.
- **Docker Improvements**: Updated Dockerfile to include e2e testing in the build process, with optimizations for production builds.

## CI/CD Setup 🧩

### GitHub Actions Workflow

Docker Publishing Workflow: Includes a 5-minute timeout to prevent hangs during the build and push steps in the `docker-publish.yml` file.

## Dependencies 📦

- `@nestjs/bull`: For handling job queues.
- `axios`: For making HTTP requests in both the app and test cases.
- `socket.io-client`: For supporting WebSocket connections in testing scenarios.

## Changelog 📋

For detailed changes, see the CHANGELOG.

## License 📄

This project is licensed under the MIT License.

Feel free to expand on sections like configuration details, CI/CD setup, or usage instructions based on your project’s specifics.
