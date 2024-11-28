# Base image for compiling and running Java programs
FROM openjdk:latest

# Set working directory
WORKDIR /app

# Command to compile and execute a Java program
# Assumes the Java file is provided as 'Main.java'
CMD ["sh", "-c", "javac Main.java && java Main"]
