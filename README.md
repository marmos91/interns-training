# Cubbit training repository 

Hi ${name}, and welcome to the Cubbit training repository's level 3.

In this level you will be prompted to implement a basic chat server alongside with a basic client class to send and broadcast message to all the registered users. If you are not familiar with concepts like *[sockets](https://it.wikipedia.org/wiki/Socket_(reti))* and *networking* refer to this [guide](https://nodejs.org/api/dgram.html) or ask for help on slack or mail.

In this example we will use the **UDP protocol** since it is the simplest, lightest and is also the easiest one to learn.

To work properly this example needs 2 classes which will be described in the next sections: `Server` and `Client`

## Server
The server is the **rendezvous point** for our clients and it manages all the connections in a model known as **[publish/subscribe](https://it.wikipedia.org/wiki/Publish/subscribe)**

It has **3 private members**:

1. **_port**: `number` {The port on which the server listen onto}
2. **_socket**: `udp4 socket` {The socket used to send and receive the messages}
3. **_clients**: `dictionary<id: IClient>` {The data structure in which the registered clients are stored} (*a little hint*: in Typescript you can declare a dictionary in this way: `{[id: number] : IClient};`)

It exposes only **2 public methods**:

1. `listen(port?: number | (port: number) => void, callback?: (port: number) => void)`: This method binds the socket to the chosen port. If no port is passed to the method (`server.listen()`) the default port of `8000` must be used. If a callback is passed (`server.listen(callback)`), it should be called when the server is ready. Finally, if both a port and a callback are passed (`server.listen(2000, callback)`), it should bind the socket to the given port and call the callback when ready. The callback must receive the port used to bind the socket as a parameter.
2. `shutdown(callback?)`: This method close the socket, instantiate a new one (in order to perform another bind call) and calls the callback (if passed).

The server can receive only 4 types of messages (interface `IMessage`): 

- `REGISTRATION`, 
- `LEAVE`, 
- `MESSAGE`, 
- `BROADCAST` 

When it receives a **REGISTRATION** message it should **add the client** (interface `IClient`) **to the dictionary** (why a dictionary instead of a list? Try to answer yourself...).
When a **LEAVE** message is received, it should **remove the corresponding client from the dictionary**. When a **MESSAGE** request is received it should **forward the message's `payload`** to the destination client. Finally, when a **BROADCAST** message is received, it should send the `payload` of the message to **all the subscribed clients**. Note that all the clients has to be notified **instead of the sender itself**.

Example of usage of the server class:

```typescript
import Server from './Server';

let server = new Server();

// It prints "Listening on port: 2000" after binding the socket
server.listen(2000, (port) => console.log('Listening on port:', port));
```

## Client

The client is a single instance of our chat service, client-side. It must implement the following **private members**:

1. **_id**: `number` {The client id to recognize it in the system}
2. **_username**: `string` {The chosen username for the client}
3. **_socket**: `udp4 socket` {The socket used to send and receive messages}
4. **_server**: `Address` {The address of the server which the client is connected to} (Address is defined in the `Interfaces.ts` file)   

The constructor accepts 2 arguments: **id** and **username**.

```typescript
let client = new Client(1, 'my-username');
```

The class additionally exposes the following public methods:

- `connect(server?: Address): Promise <Address>`: this method connects the client to the server (the default one is `{ip: 'localhost', port: 8000}` if not specified in the parameter. It returns a Promise which resolves with the server's address when the connection is established. 
- `disconnect(): Promise <any>`: this method disconnects the client from the server, instantiate another udp4 socket (in order to bind a new one if a reconnection occurs) and resolves when completed.
- `send(message: string, to: number): Promise <any>`: this method sends a message to the server specifying the message payload (aka `message`) and the id of the client the message is sent to. It resolves the Promise when the message is sent.
- `broadcast(message: string): Promise <any>`: this method sends a broadcast message to the server specifying the payload of the message to be broadcasted.  
It resolves the Promise when the message is sent.

The client must also print all the message it receives from server in order to show the result on the terminal.

An example of the library could be:

```typescript
import {Client, Server} from 'lib';

let server = new Server();

let client1 = new Client(1, 'username1');
let client2 = new Client(2, 'username2');
let client3 = new Client(3, 'username3'); 

server.listen((port: number) => 
{
	client1.connect().then((address1) => client2.connect()).then((address2) => client3.connect()).then((address3) => 
	{
		client1.send('Hello', 2).then(() => 
		{
			client2.broadcast('Oh. Hi there!');
		});
	});
});
```

## Info and help
For info about this repository please write on the #help channel on slack or to:

- [marco.moschettini@cubbit.net](mailto:marco.moschettini@cubbit.net)
- [alessio.paccoia@cubbit.net](alessio.paccoia@cubbit.net)
