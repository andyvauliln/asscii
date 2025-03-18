# Use Node.js 22 LTS version with Alpine as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    bash \
    libusb-dev \
    linux-headers \
    udev eudev-dev

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Copy the rest of the application source code
COPY . .

RUN npm install -g npm@11.0.0
RUN npm update
# Install dependencies in production mode
RUN npm install
RUN npm run build
# RUN npm ci --only=production

# Expose the application port (adjust if necessary)
EXPOSE 3000

# Define the command to start the application
CMD ["npm", "start"]