import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    );

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, HEAD, DELETE, OPTIONS',
    );

    res.setHeader('Access-Control-Max-Age', '1000');
    if (req.method.toUpperCase() === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    next();
  }
}
