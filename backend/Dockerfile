# Use official Node.js image as base
FROM node:18-bullseye

# Install Python3 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend files
COPY . /app

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install mediapipe opencv-python numpy

# Expose port (Railway will set PORT env var)
EXPOSE 8080

# Start the Node.js server
CMD ["npm", "start"]
