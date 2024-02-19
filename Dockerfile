FROM --platform=linux/amd64  node:18 AS deps
WORKDIR /app
COPY package.json  ./
RUN yarn install --frozen-lockfile --production=false
FROM --platform=linux/amd64 node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apt-get install -y openssl  make gcc g++
RUN yarn run build
FROM  --platform=linux/amd64 node:18 AS runner
USER root
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN chmod -R 777 /usr/src/app
# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install -y chromium

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env
USER app
ENTRYPOINT [ "yarn", "run", "start:prod" ]