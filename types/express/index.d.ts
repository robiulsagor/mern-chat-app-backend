// types/express/index.d.ts
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: {
      userId: string;
      // You can add more properties if needed, like role, email, etc.
    };
  }
}
