FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8080
<<<<<<< HEAD
CMD ["node", "server.js"]
=======
CMD ["node", "server.js"]
>>>>>>> 2537b18 (Initial commit - full Handwrytten website crawl)
