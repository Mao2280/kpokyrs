PROJECT_NAME=kpo-kyrs
DOCKER_COMPOSE_FILE=docker-compose.yml

help: 
	@echo "build    - Build project"
	@echo "run      - Run project"
	@echo "stop     - Stop and remove all containers and networks"
	@echo "reset    - Stop and remove all containers, networks and volumes"
	@echo "log s=<name> - Show logs for <name> container"
	@echo "sh  s=<name> u=<user> - Go into <name> container as <user>" 

	@echo test_data_dump
	@echo test_data_reset
	@echo makemigrations
	@echo makemigrations-empty
	@echo migrate

build:
	export DOCKER_BUILDKIT=1 && \
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) build --parallel

run:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) up
stop:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) stop 
down:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) down
reset:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) down -v
log:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) logs -f $(s)	
sh:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) exec -u $(u) $(s) sh


test_data_dump:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) exec back sh utils/test_data_dump.sh
test_data_reset:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) run back sh utils/test_data_reset.sh
makemigrations:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) exec back python manage.py makemigrations
makemigrations-empty:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) exec back python manage.py makemigrations source --name new_empty --empty
migrate:
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) exec back python manage.py migrate 