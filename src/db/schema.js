import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

/* STUDENTS */
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

/* TESTS */
export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
});

/* RESULTS */
export const results = pgTable("results", {
  id: serial("id").primaryKey(),

  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),

  testId: integer("test_id")
    .notNull()
    .references(() => tests.id),

  score: integer("score").notNull(),
});

/* NOTES */
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});