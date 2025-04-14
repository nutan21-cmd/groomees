**Local Development**   
To run API server and Mongodb at localhost:3000 
```docker compose -f docker-compose.dev.yaml up```

**Upload to google cloud server**  
- git add .  
- git commit  
- git push origin main
- wait for few minutes for GHA to finish uploading image
- ssh into google cloud VM:       
```gcloud compute ssh --project=groomees-63765 --zone=asia-south2-c instance-20250405-130557```
- cd ~/groomees
- git fetch --all
- git reset --hard origin/main
- sudo docker compose -f docker-compose.yaml pull
- sudo docker compose -f docker-compose.yaml up -d

**How to Build Frontend APK**  
- rm -rf www
- ionic build
- ionic capacitor add android
- ionic capacitor open android
- android:usesCleartextTraffic="true