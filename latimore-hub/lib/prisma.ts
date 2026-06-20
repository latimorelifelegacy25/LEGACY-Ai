import type { PrismaClient } from '@prisma/client';

type PrismaModel = Record<string | symbol, (...args: unknown[]) => Promise<unknown>>;
type PrismaRuntime = PrismaClient & Record<string | symbol, PrismaModel | ((...args: unknown[]) => Promise<unknown>)>;

const globalForPrisma = globalThis as unknown as { prisma: PrismaRuntime | undefined };

const READ_FALLBACKS: Record<string, unknown> = {
  count: 0,
  findMany: [],
  findFirst: null,
  findUnique: null,
  groupBy: [],
  aggregate: {},
};

function createUnavailableClient(error: unknown): PrismaRuntime {
  const message = error instanceof Error ? error.message : 'Prisma client unavailable';

  return new Proxy({} as PrismaRuntime, {
    get(_target, prop: string | symbol) {
      if (prop === 'then') return undefined;

      if (prop === '$disconnect' || prop === '$connect') {
        return async () => undefined;
      }

      if (typeof prop === 'string' && prop.startsWith('$')) {
        return async () => {
          throw new Error(`Prisma is unavailable: ${message}`);
        };
      }

      return new Proxy({} as PrismaModel, {
        get(_model, operationName: string | symbol) {
          if (operationName === 'then') return undefined;

          return async () => {
            const op = String(operationName);
            if (op in READ_FALLBACKS) return READ_FALLBACKS[op];
            throw new Error(`Prisma is unavailable for ${String(prop)}.${op}: ${message}`);
          };
        },
      });
    },
  });
}

async function getPrisma(): Promise<PrismaRuntime> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  try {
    const { PrismaClient } = await import('@prisma/client');
    const client = new PrismaClient({
      log: ['query'],
    }) as PrismaRuntime;

    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
    return client;
  } catch (error) {
    const client = createUnavailableClient(error);
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
    return client;
  }
}

function createModelProxy(modelName: string | symbol): PrismaModel {
  return new Proxy({} as PrismaModel, {
    get(_target, operationName: string | symbol) {
      if (operationName === 'then') return undefined;

      return async (...args: unknown[]) => {
        const client = await getPrisma();
        const model = client[modelName] as PrismaModel | undefined;
        const operation = model?.[operationName];

        if (typeof operation !== 'function') {
          throw new Error(`Prisma model operation not available: ${String(modelName)}.${String(operationName)}`);
        }

        return operation.apply(model, args);
      };
    },
  });
}

export const prisma = new Proxy({} as PrismaRuntime, {
  get(_target, prop: string | symbol) {
    if (prop === 'then') return undefined;

    if (typeof prop === 'string' && prop.startsWith('$')) {
      return async (...args: unknown[]) => {
        const client = await getPrisma();
        const method = client[prop];

        if (typeof method !== 'function') {
          throw new Error(`Prisma method not available: ${prop}`);
        }

        return method.apply(client, args);
      };
    }

    return createModelProxy(prop);
  },
});
