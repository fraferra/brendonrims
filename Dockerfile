# Use an official Node runtime as a parent image
FROM node:14

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

ENV TWILIO_ACCOUNT_SID=AC7930743438817010ea8a9b11c33fcb23
ENV TWILIO_AUTH_TOKEN=cab10826f3c03c29484cae257ac36d30
ENV TWILIO_NUMBER=+18882311125
ENV TARGET_NUMBER=+18587293445 
# Start the application
CMD ["node", "server.js"]
