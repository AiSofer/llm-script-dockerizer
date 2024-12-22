# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Install required dependencies for Docker CLI
RUN apk add --no-cache \
    docker-cli \
    curl \
    bash \
    git

# Copy the application code into the container
COPY . .

# Make the CLI script executable
RUN chmod +x src/cli/index.js

# Define the default command for the CLI tool
ENTRYPOINT ["node", "src/cli/index.js"]
