# Seller

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Installing Dependencies](#installing-dependencies)
    - [Running the Application](#running-the-application)
    - [Docker Setup](#docker-setup)
    - [Environment Variables](#environment-variables)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)
7. [Contact](#contact)

## Introduction

**Seller** is a Point of Sale (POS) and Inventory Management System designed for use at conventions, markets, and other events where individuals set up small stalls to sell their items. The goal is to provide a seamless and efficient way to track sales and gain meaningful insights at the end of the day.

## Features

- **Sales Tracking**: Easily add items to an invoice and post the invoice to automatically reduce stock.
- **Inventory Management**: Keep track of quantities and manage your inventory effectively.
- **Web Application**: Accessible from any web browser.
- **Future Development**: Client applications for desktop (Electron) and Android are coming soon.

## Installation

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm. Follow the [official Node.js installation guide](https://nodejs.org/en/download/package-manager/) to install Node.js.
- You have installed MongoDB. Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/installation/) to install MongoDB.

### Installing Dependencies

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/seller.git
   cd seller
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the MongoDB service:
   ```bash
   mongod
   ```

2. Start the application:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:3000` in your web browser.

### Docker Setup

Alternatively, you can use Docker to set up and run the application.

1. Ensure you have Docker installed. Follow the [official Docker installation guide](https://docs.docker.com/get-docker/) to install Docker.

2. Build and run the Docker container:
   ```bash
   docker-compose up --build
   ```

3. Navigate to `http://localhost:3001` in your web browser.

### Environment Variables

In a production environment, set the MONGODB_URI environment variable on your server or hosting provider. For local development, use a .env.local file.

## Usage

Once the application is running, navigate to the appropriate URL:

- If running directly, go to `http://localhost:3000`.
- If running through Docker, go to `http://localhost:3001`.

From the web application, you can:

- Add items to your inventory.
- Create and post invoices.
- Track your sales and inventory levels.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or questions, please contact [Seyone Gunasingham](mailto:s.g.seyone@live.com).
