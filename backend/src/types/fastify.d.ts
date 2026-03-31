export type RequestUser = {
  id: string;
  email: string;
  username: string;
  roles: string[];
  permissions: string[];
};

declare module 'fastify' {
  interface FastifyRequest {
    user?: RequestUser;
  }
}
