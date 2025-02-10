import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import mongoose from "mongoose";
import { User } from "./models/User";
import { connectDB } from "./database";

const PROTO_PATH = path.join(__dirname, "../proto/user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

const server = new grpc.Server();

// Connect to DB before starting the service
connectDB();

server.addService(userProto.user.UserService.service, {
  GetUser: async (call: any, callback: any) => {
    try {
      const userId = call.request.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "Invalid user ID",
        });
        return;
      }
      const user = await User.findById(userId);
      if (user) {
        callback(null, user.toObject());
      } else {
        callback({ code: grpc.status.NOT_FOUND, message: "User not found" });
      }
    } catch (error) {
      console.error("Database error in GetUser:", error);
      callback({ code: grpc.status.INTERNAL, message: "Database error" });
    }
  },

  CreateUser: async (call: any, callback: any) => {
    try {
      const existingUser = await User.findOne({ email: call.request.email });
      if (existingUser) {
        callback({
          code: grpc.status.ALREADY_EXISTS,
          message: "Email already exists",
        });
        return;
      }
      const newUser = await User.create({
        name: call.request.name,
        email: call.request.email,
      });
      callback(null, newUser.toObject());
    } catch (error) {
      console.error("Database error in CreateUser:", error);
      callback({ code: grpc.status.INTERNAL, message: "Error creating user" });
    }
  },
});
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("User service running on port 50051");
    server.start();
  }
);
