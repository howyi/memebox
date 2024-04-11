import {
    json,
    pgTableCreator,
    serial,
    text,
    timestamp,
    varchar
} from 'drizzle-orm/pg-core';
import {Installation} from "@slack/bolt";

const pgTable = pgTableCreator((name) => `memebox_${name}`);

export const slack_installation = pgTable(
    'slack_installation',
    {
        id: varchar('id', { length: 255 }).primaryKey().notNull(),
        installation: json('installation').$type<Installation>(),
    },
);

export const memes = pgTable(
    'memes',
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        slackTeamId: varchar("slackTeamId", { length: 255 }).notNull(),
        author: text("author"),
        text: text("text"),
        url: varchar("url", { length: 255 }).unique(),
        created_at: timestamp("created_at").notNull(),
    },
);