BINARY_NAME=obsmusicserver

all: run

deps:
	go get github.com/gorilla/websocket

build:
	go build -o cmd/server/${BINARY_NAME} cmd/server/main.go

#test:
#	go test -v cmd/server/main.go

run:
	go build -o cmd/server/${BINARY_NAME} cmd/server/main.go
	./cmd/server/${BINARY_NAME}

clean:
	go clean
	rm cmd/server/${BINARY_NAME}
