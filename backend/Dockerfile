# build stage
FROM node AS base
WORKDIR /app
EXPOSE 3000

# devlopment stage 
FROM base AS devlopment
COPY package*.json ./
RUN npm install
ENV NODE_ENV=devlopment
CMD ["npm", "run", "dev"]

# production stage
FROM node AS production
COPY package*.json ./
RUN npm install 
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
