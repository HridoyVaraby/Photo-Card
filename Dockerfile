# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /app

# Create non-root user for security
RUN addgroup -g node && adduser -g node -G node -s /bin/sh
USER node

# Expose port 3000 (Vite default)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD node -e "require('http').createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('healthy'); }).listen(3000)" || exit 1

# Start the application
CMD ["npm", "start"]
