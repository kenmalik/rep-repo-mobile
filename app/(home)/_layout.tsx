import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function HomeLayout() {
  return (
    <SQLiteProvider
      databaseName="data.db"
      assetSource={{ assetId: require("./assets/test-data.db") }}
    >
      <Stack>
        <Stack.Screen name="index" options={{ title: "Workouts" }} />
        <Stack.Screen
          name="newWorkout"
          options={{ presentation: "modal", title: "New Workout" }}
        />
        <Stack.Screen name="workouts/[id]" />
      </Stack>
    </SQLiteProvider>
  );
}
