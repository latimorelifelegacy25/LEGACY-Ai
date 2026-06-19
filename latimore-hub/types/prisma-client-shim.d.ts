// Fallback typing for offline/CI checks before `prisma generate` has produced
// node_modules/.prisma/client. Real generated Prisma types take precedence after
// `npm run db:generate` or package postinstall runs in deployment.
declare module '@prisma/client' {
  export class PrismaClient {
    [model: string]: any;
    constructor(...args: any[]);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
  }
}
