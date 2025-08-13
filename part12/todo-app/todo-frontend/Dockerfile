FROM node:20 AS build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci

FROM build-stage AS tests
RUN npm test -- --run

FROM tests AS build
ENV VITE_BACKEND_URL="/api"
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html