# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npx vite build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist .

USER node

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npx", "serve", "-s", ".", "-l", "3000"]
