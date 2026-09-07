import { prisma } from './prisma';

async function seed() {
  console.log('Seeding Ledger Database...');

  // Create or update demo user
  const user = await prisma.user.upsert({
    where: { username: 'trader' },
    update: {},
    create: {
      username: 'trader',
      themePreference: 'dark'
    }
  });

  console.log(`Demo User Created/Found: ${user.username} (${user.id})`);

  // Default watchlist symbols
  const defaultSymbols = ['TCS', 'INFY', 'HDFCBANK', 'RELIANCE', 'TATAMOTORS', 'ONGC'];

  for (const symbol of defaultSymbols) {
    await prisma.watchlistItem.upsert({
      where: {
        userId_symbol: {
          userId: user.id,
          symbol
        }
      },
      update: {},
      create: {
        userId: user.id,
        symbol
      }
    });
  }

  // Create sample price alert
  await prisma.priceAlert.create({
    data: {
      userId: user.id,
      symbol: 'TCS',
      targetPrice: 3600.0,
      direction: 'ABOVE'
    }
  }).catch(() => {});

  console.log('Database Seeding Completed Successfully.');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
