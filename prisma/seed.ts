const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: { name: 'Manager' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: { name: 'User' },
  });

  console.log(`Roles seeded: ${adminRole.name}, ${managerRole.name}, ${userRole.name}`);


  const organization = await prisma.organization.upsert({
    where: { name: 'Infigon Pvt Ltd' },
    update: {},
    create: {
      name: 'Infigon Pvt Ltd',
    },
  });

  console.log(`Organization seeded: ${organization.name}`);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: 'Admin1234',
      roles: {
        create: [{ roleId: adminRole.id }],
      },
    },
  });

  console.log(`Admin user seeded: ${adminUser.email}`);


  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@gmail.com' },
    update: {},
    create: {
      email: 'manager@gmail.com',
      password: 'Manager1234',
      organizationId: organization.id,
      roles: {
        create: [{ roleId: managerRole.id }],
      },
    },
  });

  console.log(`Manager user seeded: ${managerUser.email}`);


  const normalUser = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      password: 'User1234',
      organizationId: organization.id,
      roles: {
        create: [{ roleId: userRole.id }],
      },
    },
  });

  console.log(`Normal user seeded: ${normalUser.email}`);


  const project = await prisma.project.create({
    data: {
      name: 'Role Based Access-1',
      organizationId: organization.id,
    },
  });

  console.log(`Project seeded: ${project.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });