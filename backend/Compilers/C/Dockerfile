# Base image for compiling and running C programs
FROM gcc:latest

# Set working directory
WORKDIR /app

# Command to compile and execute a C program
# Assumes the C file is provided as 'main.c'
CMD ["sh", "-c", "gcc -o main main.c && ./main"]
