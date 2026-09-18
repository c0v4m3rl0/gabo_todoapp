import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  correo: varchar("correo", { length: 255 }).notNull().unique(),
  // Hash de bcrypt, NUNCA la contraseña en texto plano.
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tareas = pgTable(
  "tareas",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),

    nombre: text("nombre").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    usuarioIdIndex: index("tareas_usuario_id_idx").on(table.usuarioId),
  }),
);
