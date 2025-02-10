# User Service

## Build Docker Image

```sh
docker build -t user-service .
```

## Run Docker Container

```sh
docker run -d -p 50051:50051 --name user-service user-service
```

## Test the Service

You can use a gRPC client to test the service. Here is an example using `grpcurl`:

### Install grpcurl

```sh
brew install grpcurl
```

### Test GetUser

```sh
grpcurl -plaintext -d '{"userId": "123"}' localhost:50051 user.UserService/GetUser
```

### Test CreateUser

```sh
grpcurl -plaintext -d '{"name": "John Doe", "email": "john.doe@example.com"}' localhost:50051 user.UserService/CreateUser
```
