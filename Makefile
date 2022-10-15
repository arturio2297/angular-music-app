start-backend:
	mvn spring-boot:run

start-front:
	nvm use 18.6.0
	npm --prefix client-app start
