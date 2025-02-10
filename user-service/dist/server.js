"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_js_1 = __importDefault(require("@grpc/grpc-js"));
const proto_loader_1 = __importDefault(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.join(__dirname, "../proto/user.proto");
const packageDefinition = proto_loader_1.default.loadSync(PROTO_PATH);
const userProto = grpc_js_1.default.loadPackageDefinition(packageDefinition);
const users = new Map();
const server = new grpc_js_1.default.Server();
server.addService(userProto.user.UserService.service, {
    GetUser: (call, callback) => {
        const user = users.get(call.request.userId);
        if (user) {
            callback(null, user);
        }
        else {
            callback({ code: grpc_js_1.default.status.NOT_FOUND, message: "User not found" });
        }
    },
    CreateUser: (call, callback) => {
        const userId = `user_${users.size + 1}`;
        const newUser = Object.assign({ userId }, call.request);
        users.set(userId, newUser);
        callback(null, newUser);
    }
});
server.bindAsync("0.0.0.0:50051", grpc_js_1.default.ServerCredentials.createInsecure(), () => {
    console.log("User service running on port 50051");
    server.start();
});
