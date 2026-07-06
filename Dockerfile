FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install --production

# Copy server and frontend
COPY server.js .
COPY public/ public/

# Do NOT pre-create /data — let the bind mount handle it
# DATA_DIR is set via docker-compose environment

ENV PORT=3000
ENV DATA_DIR=/data

EXPOSE 3000

CMD ["node", "server.js"]
