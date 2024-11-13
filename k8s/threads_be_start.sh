#!/bin/bash

# Thiết lập biến
STACK_NAME="my_stack"          # Tên của stack
SERVICE_NAME="app"             # Tên của service trong stack

# Kiểm tra nếu script được chạy với quyền root
if [ "$(id -u)" -ne 0 ]; then
    echo "Vui lòng chạy script với quyền root!"
    exit 1
fi

# Cập nhật lại service và force restart
echo "Updating and restarting service '$SERVICE_NAME' in stack '$STACK_NAME'..."
docker service update --force $STACK_NAME"_"$SERVICE_NAME

# Kiểm tra trạng thái của service sau khi update
echo "Checking the status of the service..."
SERVICE_STATUS=$(docker service ps $STACK_NAME"_"$SERVICE_NAME --filter "desired-state=running" --format "{{.CurrentState}}")

# Kiểm tra nếu service đã chạy thành công
if [[ "$SERVICE_STATUS" == *"Running"* ]]; then
    echo "Service '$SERVICE_NAME' restarted successfully."

    # Chui vào container
    CONTAINER_ID=$(docker ps -q --filter "name=$STACK_NAME"_"$SERVICE_NAME")
    if [ -z "$CONTAINER_ID" ]; then
        echo "Không tìm thấy container cho service '$SERVICE_NAME'."
        exit 1
    fi

    # Cài đặt ts-node global trong container
    echo "Cài đặt ts-node toàn cục trong container..."
    docker exec -it $CONTAINER_ID bash -c "npm install -g ts-node"

    # Chạy lệnh ts-node để chạy seed
    echo "Chạy lệnh ts-node để chạy seed..."
    docker exec -it $CONTAINER_ID bash -c "ts-node ./node_modules/typeorm-extension/bin/cli.cjs seed:run -d ./dist/db/data-source.ts"

    echo "Done."
else
    echo "Failed to restart service '$SERVICE_NAME'."
    exit 1
fi
