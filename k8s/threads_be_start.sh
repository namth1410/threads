#!/bin/bash

# Thiết lập biến
DOCKER_USER="dangnam141002"
DOCKER_IMAGE="threads_be"           # Tên image
DOCKER_TAG="latest"                 # Tag của image
CONTAINER_NAME="threads_container"   # Tên container
PROJECT_DIR="$HOME/threads"              # Đường dẫn đến thư mục dự án

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH=$PATH:/home/namth/.nvm/versions/node/v20.10.0/bin/npm
# Di chuyển vào thư mục dự án
cd $PROJECT_DIR || exit 1
echo "Navigating to project directory..."

# Cập nhật mã nguồn từ nhánh main
echo "Pulling latest code from main branch..."
git pull origin main

# Chạy migration
echo "Running migrations..."
npm i
npm run migration:run

# Kiểm tra xem container có đang chạy không
if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
    echo "Stopping and removing existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
else
    # Kiểm tra xem container đã tồn tại nhưng không chạy
    if [ $(docker ps -aq -f name=$CONTAINER_NAME) ]; then
        echo "Removing existing stopped container..."
        docker rm $CONTAINER_NAME
    fi
fi

# Kéo image mới nhất từ Docker Hub
echo "Pulling the latest image..."
docker pull "$DOCKER_USER/threads_be:$DOCKER_TAG"

# Chạy container mới
echo "Starting the container..."
docker run -d --name $CONTAINER_NAME \
    -e DB_HOST=36.50.176.49 \
    -e DB_PORT=5432 \
    -e DB_USER=namth \
    -e DB_PASSWORD=01664157092aA \
    -e DB_NAME=threads_db \
    -e MINIO_ENDPOINT=36.50.176.49 \
    -e MINIO_PORT=9000 \
    -e MINIO_ACCESS_KEY=namth \
    -e MINIO_SECRET_KEY=01664157092aA \
    -e MINIO_USE_SSL=false \
    -e MINIO_BUCKET_NAME=threads \
    -p 3000:3000 \
    $DOCKER_USER/$DOCKER_IMAGE:$DOCKER_TAG

# Kiểm tra xem container đã chạy thành công chưa
if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
    echo "Container started successfully!"
else
    echo "Failed to start the container!"
    exit 1
fi
