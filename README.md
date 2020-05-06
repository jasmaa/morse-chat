# Morse Chat

P2P Morse code with WebRTC

## Build and Run

### Local Development
    # client
    yarn install
    yarn start

    # backend
    yarn install
    node server.js

### Docker
    docker build -t morse-chat .
    docker run --rm -p 3001:3001 morse-chat:latest