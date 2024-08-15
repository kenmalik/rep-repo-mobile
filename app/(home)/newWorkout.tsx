import { Link } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

export default function NewWorkout() {
  const db = SQLite.useSQLiteContext();
  const [title, setTitle] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.inputTitle}>Workout Title:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Title"
        clearButtonMode="always"
        onChangeText={setTitle}
      />
      <Link href="../" asChild>
        <Pressable
          style={styles.button}
          disabled={title === ""}
          onPress={() => addWorkout(db, title)}
        >
          <Text style={styles.buttonText}>Add workout</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function addWorkout(db: SQLite.SQLiteDatabase, title: string) {
  const result = db.runSync(
    "INSERT INTO workouts_test(title) VALUES (?)",
    title,
  );

  console.log(`Added ${title}`);
  console.log(result);
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
  },
  inputTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    padding: 16,
    marginBottom: 32,
    backgroundColor: "white",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "lightblue",
  },
  buttonText: {
    color: "white",
  },
});
