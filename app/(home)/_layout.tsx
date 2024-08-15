import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Workouts" }} />
      <Stack.Screen name="workouts/[id]" />
      <Stack.Screen
        name="newWorkout"
        options={{ presentation: "modal", title: "New Workout" }}
      />
    </Stack>
  );
}
