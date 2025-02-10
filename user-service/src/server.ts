import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from "path";

const PROTO_PATH = path.join(__dirname, "../proto/user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

const users = new Map<string, { userId: string; name: string; email: string }>();

const server = new grpc.Server();

server.addService(userProto.user.UserService.service, {
  GetUser: (call: any, callback: any) => {
    const user = users.get(call.request.userId);
    if (user) {
      callback(null, user);
    } else {
      callback({ code: grpc.status.NOT_FOUND, message: "User not found" });
    }
  },
  CreateUser: (call: any, callback: any) => {
    const userId = `user_${users.size + 1}`;
    const newUser = { userId, ...call.request };
    users.set(userId, newUser);
    callback(null, newUser);
  }
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
  console.log("User service running on port 50051");
  server.start();
});
