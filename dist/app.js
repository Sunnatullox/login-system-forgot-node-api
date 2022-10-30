"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const errorHanlder_1 = require("./middleware/errorHanlder");
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(errorHanlder_1.errorHandler);
app.use((0, cors_1.default)());
app.use(() => {
    throw (0, http_errors_1.default)(404, "Route not found");
});
app.use("/api", userRoutes_1.default);
mongoose_1.default
    .connect(config_1.DB)
    .then(() => {
    console.log("Connected to mongoDb");
    app.listen(config_1.PORT, () => {
        console.log(`Listening On PORT ${config_1.PORT}`);
    });
})
    .catch(() => {
    throw (0, http_errors_1.default)(501, "Unable to connect database");
});
