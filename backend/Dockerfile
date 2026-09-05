# base stage
FROM node AS base
WORKDIR /app
EXPOSE 3000

# devlopment stage 
FROM base AS development
COPY package*.json ./
RUN npm install
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]

# production stage
FROM base AS production
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
