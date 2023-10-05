# Use a Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Angular application for production
RUN npm run build --prod

# Use an Nginx base image to serve the application
FROM nginx:alpine

# Copy the built application from the previous image to the Nginx directory
COPY --from=0 /usr/src/app/dist/heroes-app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
