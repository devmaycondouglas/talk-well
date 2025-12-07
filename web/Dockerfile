# ---- Etapa 1: Build ----
FROM node:21-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Instala dependências
RUN npm install --legacy-peer-deps

# Copia o restante do projeto
COPY . .

# Build do frontend
RUN npm run build

# ---- Etapa 2: Servir com Nginx ----
FROM nginx:alpine

# Remove site padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados pelo Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia uma configuração personalizada do Nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
