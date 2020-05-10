FROM node:alpine as frontend
WORKDIR /tmp/client
COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn install
COPY client .
RUN yarn build

FROM node:alpine
WORKDIR /opt
COPY backend .
RUN yarn install
COPY --from=frontend /tmp/client/dist ./public

CMD yarn start