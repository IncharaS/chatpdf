import { integer, pgEnum, pgTable, serial, text, time, timestamp, varchar} from 'drizzle-orm/pg-core'
//pgcore contains lot of utilities like integer, pg table

// chats is the table name and the rest are colums
export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    // import serial, text, timestamp, varchar from pgcore and not Drizzlecore
    // gel-core package does not define the correct type that pgTable expects.
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: time('created_at').notNull().defaultNow(),
    userId: varchar('user_id', { length: 258 }).notNull(),
    fileKey: text('file_key').notNull(),

})

export type DrizzleChat = typeof chats.$inferSelect;

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])

export const messages = pgTable("messages", {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(() => chats.id).notNull(),
    //foreign key
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnum('role').notNull()
    //if its system, then its ChatGPT
    //else its User
})

//drizzle-orm
//drizzle-kit, helps us to create migrations and all database is synced up with schema here
// npm install drizzle-kit

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 256,
  }).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
});

