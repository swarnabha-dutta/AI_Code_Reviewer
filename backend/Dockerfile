# Use Node LTS
FROM node:20-alpine


# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose backend port
EXPOSE 3030

# Start server
CMD ["node", "server.js"]
