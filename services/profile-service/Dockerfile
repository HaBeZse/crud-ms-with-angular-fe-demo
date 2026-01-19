FROM node:20-alpine AS build
WORKDIR /repo

COPY package.json package-lock.json ./
COPY services/profile-service/package.json services/profile-service/package.json

RUN npm ci --workspaces --include-workspace-root=false

COPY services/profile-service services/profile-service
RUN npm run -w services/profile-service build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY services/profile-service/package.json services/profile-service/package.json
RUN npm ci --omit=dev --workspaces --include-workspace-root=false

COPY --from=build /repo/services/profile-service/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main.js"]
