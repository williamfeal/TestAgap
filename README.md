# Aplicación HeroesApp

Esta es la aplicación `HeroesApp`, una aplicación Angular diseñada para gestionar héroes.

## Requisitos

- Node.js
- Angular CLI
- Docker (opcional)

## Instalación

1. Clona el repositorio:
git clone https://github.com/williamfeal/TestAgap.git

2. Navega al directorio del proyecto:
cd TestAgap

3. Instala las dependencias:
npm install

## Ejecución

Para ejecutar la aplicación en modo desarrollo:
ng serve
Visita `http://localhost:4200/` en tu navegador.

## Dockerización

Si prefieres ejecutar la aplicación usando Docker, sigue estos pasos:

1. Construye la imagen Docker:
docker build -t heroesapp .

2. Ejecuta el contenedor:
docker run -p 80:80 heroesapp
Visita `http://localhost/` en tu navegador.








