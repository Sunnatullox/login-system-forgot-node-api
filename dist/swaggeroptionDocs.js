"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var swaggerJsdoc = require('swagger-jsdoc');
var options = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'],
};
var openapiSpecification = swaggerJsdoc(options);
exports.default = openapiSpecification;
