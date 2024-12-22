# **LSD-CLI (LLM Script Dockerizer) Tool**

The **LLM Script Dockerizer** is a CLI tool designed to wrap scripts in Dockerfiles using a generative AI model. It supports multiple LLM vendors (OpenAI, HuggingFace, etc.) and allows for seamless generation, testing, and execution of Dockerized scripts.

---

## **Features**

- Generates Dockerfiles for one-pager scripts in any scripting language.
- Builds and tests Docker images based on the wrapped scripts.
- Supports multiple LLM vendors with vendor-agnostic infrastructure.
- Budget-aware API usage to control costs (e.g., capped at $5 for OpenAI).
- Fully Dockerized for consistent execution across environments.
- Supports `.env` configuration for development and production.

---

## **Installation**

### **Local Setup**

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-directory>
2. Install dependencies:
   ```bash
   npm install
3. (Optional) Link the CLI globally:
   ```bash
   npm link

### **Docker Setup**

1. Build the Docker image:
   ```bash
   ENV=development docker-compose build
   
2. Run the CLI:
    ```bash
    docker-compose run cli

## Environment Configuration

The tool supports multiple environments via `.env` files.

### Environment Files
- `.env.development`: Used for local development.
- `.env.production`: Used for production deployments.

### Local Development
Set the environment before running the CLI tool, or use --env-file flag:
```bash
export NODE_ENV=development
node --env-file=.env.development src/cli/index.js wrap -s scripts/word_reverser.py -e "python word_reverser.py 'hello world'"
```

### Dockerized Usage
Build the image for development environment: 

(you can change the env_file: on the  docker-compose.yml to point to your desired .env file)
```bash
ENV=development docker-compose build
docker-compose run cli wrap -s ../scripts/word_reverser.py -e "python word_reverser.py 'hello world'"
```