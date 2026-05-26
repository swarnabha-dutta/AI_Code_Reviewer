# Use Node LTS
FROM node:20-alpine3.20

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Update base packages and install dependencies
RUN apk upgrade --no-cache && npm install

# Copy the rest of the backend code
COPY . .

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 5000

# Start compiled server
CMD ["node", "dist/server.js"]