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