import { Link, useFocusEffect } from "expo-router";
import * as SQLite from "expo-sqlite";
import { Pressable, Text, ScrollView, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCallback, useState } from "react";

interface Workout {
  id: number;
  title: string;
}

export default function Index() {
  const db = SQLite.useSQLiteContext();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useFocusEffect(
    useCallback(() => {
      let ignore = false;
      getWorkouts(db).then((result) => {
        if (!ignore) {
          setWorkouts(result);
        }
      });
      return () => {
        ignore = true;
      };
    }, [db]),
  );

  return (
    <ScrollView>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} id={workout.id} title={workout.title} />
      ))}
      <Link href={"/newWorkout"} asChild>
        <Pressable style={style.newWorkoutButton}>
          <AntDesign name="plus" size={24} color="black" />
        </Pressable>
      </Link>
    </ScrollView>
  );
}

async function getWorkouts(db: SQLite.SQLiteDatabase) {
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
    backgroundColor: "white",
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
