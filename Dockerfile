FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 7070

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7070

# Start the application
CMD ["npm", "start"]