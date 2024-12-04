FROM   node:18 AS deps
WORKDIR /app
COPY package.json  ./
RUN yarn install --frozen-lockfile --production=false
FROM  node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apt-get update && apt-get install -y openssl
RUN yarn run build
FROM   node:18 AS runner
USER root
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN chmod -R 777 /usr/src/app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env
ENTRYPOINT [ "yarn", "run", "start:prod" ]