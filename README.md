# Morse Chat

P2P Morse code with WebRTC

## Build and Run

### Local Development
    # client
    yarn install
    yarn start

    # backend
    yarn install
    yarn start

### Docker
    docker build -t morse-chat .
    docker run --rm -p 3000:3000 morse-chat:latest

## Deploy to Heroku
    heroku create <app_name>
    heroku container:push web
    heroku container:release web