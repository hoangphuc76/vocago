FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Create .env.production if it doesn't exist
RUN touch .env.production

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
