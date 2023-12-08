import {
    int,
    timestamp,
    mysqlEnum,
    mysqlTable,
    bigint,
    uniqueIndex,
    varchar,
    primaryKey,
    text
} from 'drizzle-orm/mysql-core';
import type { AdapterAccount } from "@auth/core/adapters"

export const user_slack_teams = mysqlTable(
    'user_slack_teams',
    {
        id: varchar('id', { length: 255 }).notNull(),
        slackUserId: varchar("slackUserId", { length: 255 }),
    },
(user_slack_team) => ({
    compoundKey: primaryKey(user_slack_team.id, user_slack_team.slackUserId),
}));

export const teams = mysqlTable(
    'teams',
    {
        id: varchar('id', { length: 255 }).primaryKey().notNull(),
        access_token: text("access_token"),
        bot_user_id: text("bot_user_id"),
        incoming_webhook_channel_id: text("incoming_webhook_channel_id"),
        incoming_webhook_channel_name: text("incoming_webhook_channel_name"),
        incoming_webhook_configuration_url: text("incoming_webhook_configuration_url"),
        incoming_webhook_url: text("incoming_webhook_url"),
    },
);

export const memes = mysqlTable(
    'memes',
    {
        id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
        slackTeamId: varchar("slackTeamId", { length: 255 }),
        createdUserId: varchar("createdUserId", { length: 255 }),
        text: text("text"),
        url: text("url"),
    },
);

// Next-Auth 用DB
// https://authjs.dev/reference/adapter/drizzle#mysql
export const users = mysqlTable("user", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }).defaultNow(),
    image: varchar("image", { length: 255 }),
})

// Next-Auth 用DB
// https://authjs.dev/reference/adapter/drizzle#mysql
export const accounts = mysqlTable(
    "account",
    {
        userId: varchar("userId", { length: 255 }),
        type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
        refresh_token: varchar("refresh_token", { length: 255 }),
        access_token: varchar("access_token", { length: 255 }),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: varchar("id_token", { length: 2048 }),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey(account.provider, account.providerAccountId),
    })
)

// Next-Auth 用DB
// https://authjs.dev/reference/adapter/drizzle#mysql
export const sessions = mysqlTable("session", {
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

// Next-Auth 用DB
// https://authjs.dev/reference/adapter/drizzle#mysql
export const verificationTokens = mysqlTable(
    "verificationToken",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey(vt.identifier, vt.token),
    })
)
