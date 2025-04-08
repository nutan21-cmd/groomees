To run at localhost:3000
docker compose -f docker-compose.dev.yaml up


For google cloud
git add .
git commit
git push origin main

ssh into google cloud VM
cd ~/groomies
docker compose -f docker-compose.yaml pull
docker compose -f docker-compose.yaml up -d