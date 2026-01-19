import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient, UserRole, LayoutPreset } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const storeId = uuidv4();

  const existing = await prisma.store.findFirst({ where: { name: 'Demo Store' } });
  if (existing) {
    console.log('Seed already applied (Demo Store exists).');
    return;
  }

  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 10);

  const ownerPw = await bcrypt.hash('owner1234!', rounds);
  const staffPw = await bcrypt.hash('staff1234!', rounds);

  await prisma.store.create({
    data: {
      id: storeId,
      name: 'Demo Store',
      callEnabled: true,
      callListSize: 6,
      callStartNo: 1,
      callNextNo: 1,
      layoutPreset: LayoutPreset.SPLIT2,
      users: {
        create: [
          {
            id: uuidv4(),
            email: 'owner@menucast.local',
            passwordHash: ownerPw,
            role: UserRole.OWNER,
          },
          {
            id: uuidv4(),
            email: 'staff@menucast.local',
            passwordHash: staffPw,
            role: UserRole.STAFF,
          },
        ],
      },
    },
  });

  // default playlist
  await prisma.playlist.create({
    data: {
      id: uuidv4(),
      storeId,
      name: 'Default Playlist',
    },
  });

  console.log('Seed complete.');
  console.log('OWNER: owner@menucast.local / owner1234!');
  console.log('STAFF: staff@menucast.local / staff1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
