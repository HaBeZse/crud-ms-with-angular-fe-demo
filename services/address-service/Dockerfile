FROM node:20-alpine AS build
WORKDIR /repo

COPY package.json package-lock.json ./
COPY services/address-service/package.json services/address-service/package.json

RUN npm ci --workspaces --include-workspace-root=false

COPY services/address-service services/address-service
RUN npm run -w services/address-service build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY services/address-service/package.json services/address-service/package.json
RUN npm ci --omit=dev --workspaces --include-workspace-root=false

COPY --from=build /repo/services/address-service/dist ./dist

EXPOSE 3002
CMD ["node", "dist/main.js"]
