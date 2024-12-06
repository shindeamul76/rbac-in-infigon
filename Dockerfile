
FROM node:18-alpine as build


WORKDIR /usr/src/app


COPY package.json yarn.lock ./

RUN yarn install


COPY . .


RUN npx prisma generate

RUN yarn build


FROM node:18-alpine


WORKDIR /usr/src/app


COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma


EXPOSE 3000


CMD ["sh", "-c", "yarn prisma:migrate-deploy && yarn prisma:seed && yarn start:prod"]