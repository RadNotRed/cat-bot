import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const servers = sqliteTable("servers", {
    id: text("id").primaryKey(),
    fact_channel: text("fact_channel"),
    photo_channel: text("photo_channel"),
});
