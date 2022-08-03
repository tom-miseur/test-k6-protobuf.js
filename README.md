# test-k6-protobuf.js

To run, terminal to root and run:

`go mod tidy` to download dependencies

`go run ./server/server.go` to start the server

Open a new terminal to run the k6 script:

`k6 run ./client/k6.js`