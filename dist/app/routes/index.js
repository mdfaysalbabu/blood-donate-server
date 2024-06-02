"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const user_routes_1 = require("../modules/User/user.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/login",
        route: auth_route_1.AuthRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
