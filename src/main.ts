import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("YouApp")
    .setDescription(
      `This is the official API documentation for **YouApp**, a messaging platform that provides real-time chat, profile management, and secure authentication. 
    
      Features include:
      - 🔐 JWT-based Auth with Guard
      - 👤 Profile creation & update
      - 💬 Real-time messaging (RabbitMQ-based)
      - 📦 Redis for unread status tracking
      
      All endpoints return a unified response structure using \`WebResponse<T>\`. Use the **Authorize** button to test authenticated routes.`,
    )
    .setVersion("1.0")
    .setContact(
      "Xenn-00",
      "https://github.com/xenn-00",
      "faqihfirmansyah350@gmail.com",
    )
    .setLicense("MIT", "https://opensource.org/licenses/MIT")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const logger = new Logger("Bootstrap");

  app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "img-src": ["'self'", "data:", "blob:"], // allow profile image
          "script-src": ["'self'"],
          "style-src": ["'self'", "'unsafe-inline'"],
        },
      },
      referrerPolicy: {
        policy: "no-referrer",
      },
      frameguard: {
        action: "deny",
      },
      hidePoweredBy: true,
      xssFilter: true,
      hsts: { maxAge: 31536000, includeSubDomains: true },
      noSniff: true,
      dnsPrefetchControl: { allow: false }, // turn off DNS prefetch
      crossOriginEmbedderPolicy: false, // optional, tergantung app
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "same-origin" },
    }),
  );

  app.enableCors({
    origin: ["http://localhost:3000"],
    Credential: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`🚀 App is running on http://localhost:${process.env.PORT}`);
}
void bootstrap();
