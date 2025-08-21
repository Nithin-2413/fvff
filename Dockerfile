# Use Node.js 20 official image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Create public directory and copy built files
RUN mkdir -p dist/public && cp -r dist/client/* dist/public/ 2>/dev/null || true

# Expose port
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]