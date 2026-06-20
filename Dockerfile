#Baixar a imagem oficial do Node.js
FROM node:20-alpine

#Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependências para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar todo projeto para o diretório de trabalho
COPY . .

# Documentar a porta que a aplicação irá rodar
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]