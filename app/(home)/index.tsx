import { Link } from "expo-router";
import { Pressable, View, Text, ScrollView, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface Workout {
  id: number;
  title: string;
}

const testWorkouts: Workout[] = [
  { id: 1, title: "Hello" },
  { id: 2, title: "World" },
  { id: 3, title: "My workout" },
  { id: 4, title: "Another workout" },
  { id: 5, title: "So many workouts" },
  { id: 6, title: "Abracadabra" },
  { id: 7, title: "Long title for a workout to see what happens" },
];

export default function Index() {
  return (
    <ScrollView>
      {testWorkouts.map((workout) => (
        <WorkoutCard id={workout.id} title={workout.title} />
      ))}
    </ScrollView>
  );
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
});
