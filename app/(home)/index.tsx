import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={style.container}>
      <Link href="/workouts/1">Workout 1</Link>
      <Link href="/workouts/2">Workout 2</Link>
      <Link href="/workouts/3">Workout 3</Link>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
