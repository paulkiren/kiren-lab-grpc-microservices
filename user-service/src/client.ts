import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition) as any;


const client = new userProto.user.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Test CreateUser
client.CreateUser({ name: "John Doe", email: "john@example.com" }, (err: any, response: any) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Created User:", response);
  }
});

// Test GetUser (Replace 'user_1' with a valid ID)
client.GetUser({ userId: "user_1" }, (err: any, response: any) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Fetched User:", response);
  }
});
