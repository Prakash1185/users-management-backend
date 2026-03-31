import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Start seeding...');

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
      permissions: JSON.parse(JSON.stringify([
        'users:read',
        'users:create',
        'users:update',
        'users:delete',
        'roles:read',
        'roles:create',
        'roles:update',
        'roles:delete',
        'audit:read',
        'system:manage',
      ])),
      isSystem: true,
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Regular user with basic access',
      permissions: JSON.parse(JSON.stringify([
        'profile:read',
        'profile:update',
      ])),
      isSystem: true,
    },
  });

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      description: 'Moderator with elevated permissions',
      permissions: JSON.parse(JSON.stringify([
        'users:read',
        'users:update',
        'profile:read',
        'profile:update',
        'content:moderate',
      ])),
      isSystem: true,
    },
  });

  console.log('Created roles:', { adminRole, userRole, moderatorRole });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
