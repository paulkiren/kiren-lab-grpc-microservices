# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose the gRPC port
EXPOSE 50051

# Install concurrently to run both server and client
RUN npm install -g concurrently

# Start the service
CMD ["concurrently", "\"npm run start-server\"", "\"npm run start-client\""]