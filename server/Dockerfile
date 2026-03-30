# ============================================================
# Stage 1: Instalacja zależności
# ============================================================
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm install --legacy-peer-deps

# ============================================================
# Stage 2: Build aplikacji
# ============================================================
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generowanie Prisma Client + kompilacja TypeScript
RUN npx prisma generate
RUN npm run build

# ============================================================
# Stage 3: Obraz produkcyjny
# ============================================================
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Kopiuj tylko to, co potrzebne do uruchomienia
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

# Skrypt startowy: migracja + uruchomienie serwera
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]
