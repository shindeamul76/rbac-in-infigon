FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build


FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3000


ENV NODE_ENV=production


CMD ["yarn", "start:migrate:prod"]