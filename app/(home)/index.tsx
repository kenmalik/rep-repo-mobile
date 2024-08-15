import { Link, Stack, useFocusEffect } from "expo-router";
import * as SQLite from "expo-sqlite";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCallback, useState } from "react";

interface Workout {
  id: number;
  title: string;
}

export default function Index() {
  const db = SQLite.useSQLiteContext();
  const [editing, setEditing] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  function deleteWorkout(id: number) {
    console.log(`Deleting workout ${id}`);
    db.runAsync("DELETE FROM workouts_test WHERE id == ?", id).then((result) =>
      console.log(result),
    );
    setWorkouts(workouts.filter((workout) => workout.id !== id));
  }

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
    <>
      <Stack.Screen
        options={{
          title: "Workouts",
          headerRight: () => (
            <Button
              onPress={() => setEditing(!editing)}
              title={editing ? "Done" : "Edit"}
            />
          ),
        }}
      />
      <ScrollView>
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            id={workout.id}
            title={workout.title}
            editing={editing}
            onDelete={deleteWorkout}
          />
        ))}
        <Link href={"/newWorkout"} asChild>
          <Pressable style={style.newWorkoutButton}>
            <AntDesign name="plus" size={24} color="black" />
          </Pressable>
        </Link>
      </ScrollView>
    </>
  );
}

async function getWorkouts(db: SQLite.SQLiteDatabase) {
  return db.getAllSync("SELECT * FROM workouts_test") as Workout[];
}

function WorkoutCard({
  id,
  title,
  editing,
  onDelete,
}: {
  id: number;
  title: string;
  editing: boolean;
  onDelete: Function;
}) {
  return (
    <View style={style.card}>
      <Link href={`/workouts/${id}`} asChild>
        <Pressable style={style.cardContent} disabled={editing}>
          <Text style={style.cardTitle}>{title}</Text>
          {!editing && <AntDesign name="right" size={24} color="black" />}
        </Pressable>
      </Link>
      {editing && (
        <Pressable style={style.deleteButton} onPress={() => onDelete(id)}>
          <FontAwesome name="trash-o" size={24} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  card: {
    marginTop: 32,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
  },
  cardContent: {
    padding: 32,
    flex: 1,
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
  deleteButton: {
    backgroundColor: "#dc2626",
    width: 72,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
