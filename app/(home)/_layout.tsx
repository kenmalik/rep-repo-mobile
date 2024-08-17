import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

async function testDataInit(db: SQLiteDatabase) {
  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  DROP TABLE IF EXISTS workouts_test;
  DROP TABLE IF EXISTS exercises_test;
  CREATE TABLE workouts_test(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    title VARCHAR(32) NOT NULL
  );
  INSERT INTO workouts_test(title) VALUES
    ('Workout with a really long title to see how it looks'),
    ('Third workout with a longer title for more testing'),
    ('Fourth workout'),
    ('Brigette deleted my workouts'),
    ('Trynna recover from my deleted workouts'),
    ('My workout');
  CREATE TABLE exercises_test(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    workout_id INTEGER NOT NULL,
    name VARCHAR(32) NOT NULL,
    weight INTEGER NOT NULL,
    exercise_group VARCHAR(32) NOT NULL,
    FOREIGN KEY(workout_id) REFERENCES workouts_test(id) ON DELETE CASCADE
  );
  INSERT INTO exercises_test(workout_id, name, weight, exercise_group) VALUES
    (1, 'Squat', 175, 'Lower'),
    (1, 'Deadlift', 240, 'Lower'),
    (1, 'Bench Press', 175, 'Upper'),
    (1, 'Overhead Press', 130, 'Upper'),
    (1, 'Barbell Row', 75, 'Supplementary');
  `);
}

export default function HomeLayout() {
  return (
    <SQLiteProvider databaseName="data.db" onInit={testDataInit}>
      <Stack>
        <Stack.Screen
          name="newWorkout"
          options={{ presentation: "modal", title: "New Workout" }}
        />
        <Stack.Screen name="workouts/[id]" />
      </Stack>
    </SQLiteProvider>
  );
}
