
# Online Compiler

A powerful and user-friendly tool that allows you to write, compile, and execute code in multiple popular programming languages, including Java, C, C++, and Python. Ideal for quick experiments, testing snippets, and learning programming concepts on the go.

## Installation

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js**
   - Download and install Node.js from the [official website](https://nodejs.org/).
   - Ensure you have at least version 16.x or higher.

2. **Docker**
   - Install Docker by following the instructions on the [Docker website](https://www.docker.com/products/docker-desktop).
   - Verify that Docker is running properly on your system.


#### clone the repository

```bash
  git clone https://github.com/Samiul-Islam-123/online-compiler.git
```

### Create Docker Images by running startup.js file

```bash
  node online-compiler/backend/startup.js
```

this will fireup each docker images needed for each compilers. Once this has been done, you may proceed to next step.

```bash
  cd online-compiler
  cd frontend
  npm install
  cd ../backend
  npm install
```

## Start the application locally
Now as the code has been installed properly, its time to start the application locally (self host)

### Run the backend
```bash
  cd backend
  npm start
```

### Start frontend
```bash
  cd frontend
  npm run dev
```
### Your application shoule be live at http://localhost:5173


