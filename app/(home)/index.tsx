import { Link } from "expo-router";
import * as SQLite from "expo-sqlite";
import { Pressable, Text, ScrollView, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";

interface Workout {
  id: number;
  title: string;
}

const db = SQLite.openDatabaseSync("data.db");

db.execSync(`
DROP TABLE IF EXISTS workouts_test;
CREATE TABLE IF NOT EXISTS workouts_test(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(30)
);
INSERT INTO workouts_test(title) VALUES
  ("First workout"),
  ("Second workout"),
  ("Third workout"),
  ("So many workouts"),
  ("Abracadabra"),
  ("Long title for a workout to see what happens");
`);
console.log("Test table created");

export default function Index() {
  const [workouts, setWorkouts] = useState<Workout[]>(getWorkouts());

  useEffect(() => {
    console.log("Workout added");
  }, [workouts]);

  return (
    <ScrollView>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} id={workout.id} title={workout.title} />
      ))}
      <Link href={"/newWorkout"} asChild>
        <Pressable
          style={style.newWorkoutButton}
          onPress={() => console.log("Hello")}
        >
          <AntDesign name="plus" size={24} color="black" />
        </Pressable>
      </Link>
    </ScrollView>
  );
}

function getWorkouts() {
  return db.getAllSync("SELECT * FROM workouts_test") as Workout[];
}

function WorkoutCard({ id, title }: { id: number; title: string }) {
  return (
    <Link href={`/workouts/${id}`} style={style.card} asChild>
      <Pressable style={style.cardContent}>
        <Text style={style.cardTitle}>{title}</Text>
        <AntDesign name="right" size={24} color="black" />
      </Pressable>
    </Link>
  );
}

const style = StyleSheet.create({
  card: {
    marginTop: 32,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: "#fff",
  },
  cardContent: {
    padding: 32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    maxWidth: "85%",
  },
  newWorkoutButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 64,
    marginLeft: 16,
    marginRight: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "dashed",
  },
});
