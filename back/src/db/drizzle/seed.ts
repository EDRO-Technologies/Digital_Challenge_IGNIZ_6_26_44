// import { count } from 'drizzle-orm';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';

// import config from '../../config';
// import { subscriptions } from './schema/subscriptions/schema';

// const main = async () => {
//   const pool = new Pool({
//     host: config.database.postgres.host,
//     port: +config.database.postgres.port,
//     user: config.database.postgres.user,
//     password: config.database.postgres.password,
//     database: config.database.postgres.database
//   });
//   const db = drizzle(pool);

//   const subscriptionsList: (typeof subscriptions.$inferInsert)[] = [
//     {
//       price: 0,
//       level: 'None'
//     },
//     {
//       price: 299,
//       level: 'Premium'
//     }
//   ];

//   const countSubscriptions = await db.select({ count: count() }).from(subscriptions);
//   if (countSubscriptions[0].count !== subscriptionsList.length) {
//     await db.insert(subscriptions).values(subscriptionsList);
//   }
// };

// main();
