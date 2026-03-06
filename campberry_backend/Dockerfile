FROM node:20-alpine

WORKDIR /app

COPY campberry_backend/package*.json ./
RUN npm ci

COPY campberry_backend .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start"]
