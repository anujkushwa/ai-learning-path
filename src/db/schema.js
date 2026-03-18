import {
  pgTable,
  serial,
  text,
  integer,
  timestamp
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
    .references(() => students.id)
    .notNull(),
  testId: integer("test_id")
    .references(() => tests.id)
    .notNull(),
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

/* TEST ASSIGNMENTS */
/* TEST ASSIGNMENTS */
export const testAssignments = pgTable("test_assignments", {
  id: serial("id").primaryKey(),
  testId: integer("test_id"),
  studentId: integer("student_id"),
});

/* TEACHER TOPICS */
export const teacherTopics = pgTable("teacher_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  teacherId: text("teacher_id"),
  createdAt: timestamp("created_at").defaultNow(),
});