import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const servers = sqliteTable("servers", {
    id: text("id").primaryKey(),
    fact_channel: text("fact_channel"),
    photo_channel: text("photo_channel"),
    send_facts: integer("send_facts", { mode: "boolean" }),
    send_photos: integer("send_photos", { mode: "boolean" }),
});
