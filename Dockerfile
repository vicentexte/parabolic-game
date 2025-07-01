#Compilación del frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY myfrontend/package*.json ./
RUN npm install
COPY myfrontend/ .
RUN npm run build

#Backend con frontend compilado dentro
FROM node:18 AS final
WORKDIR /app

# Instalar dependencias del backend
COPY mybackend/package*.json ./mybackend/
RUN cd mybackend && npm install
COPY mybackend/ ./mybackend/

# Puerto de backend
ENV PORT=3000
WORKDIR /app/mybackend
CMD ["npm", "start"]
