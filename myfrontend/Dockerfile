FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json primero (mejor caché de dependencias)
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 8080 (el que usa Vue por defecto)
EXPOSE 8080

# Comando por defecto: iniciar servidor de desarrollo
CMD ["npm", "run", "serve"]
