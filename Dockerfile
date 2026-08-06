FROM node:22-slim
WORKDIR /app
RUN npm install -g serve@14
COPY dist ./dist

ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "serve dist -l ${PORT}"]
