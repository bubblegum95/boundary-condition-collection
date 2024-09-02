"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const options = {
        swaggerOptions: {
            persistAuthorization: true,
        },
    };
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Boundary Condition Web-App REST API')
        .setDescription('boundary condition')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'cookies',
    }, 'authorization')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, options);
}
//# sourceMappingURL=setupSwagger.js.map