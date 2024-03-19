# test-api
User Test API

## Description

## Installation with Docker

1. Clone from git

2. cd into test

3. run `yarn install` to install all dependencies

## Running the app

```bash
# development mode with Dockerfile.dev
$ dokcer-compose up

# production mode with Dockerfile
$ dokcer-compose up
```

## Running K8s

```bash
#Configure kubectl
$ kubectl config use-context test-cluster

# Apply the deployment manifest
$ kubectl apply -f deployment.yaml