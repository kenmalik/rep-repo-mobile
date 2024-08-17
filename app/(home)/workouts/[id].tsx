import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Button,
  StyleProp,
  ViewStyle,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";

interface Exercise {
  id: number;
  name: string;
  weight: number;
  group: string;
}

const testExercises: Exercise[] = [
  { id: 1, name: "Squat", weight: 130, group: "Lower" },
  { id: 2, name: "Deadlift", weight: 230, group: "Lower" },
  { id: 3, name: "Bench Press", weight: 225, group: "Upper" },
  { id: 4, name: "Overhead Press", weight: 130, group: "Upper" },
  { id: 5, name: "Row", weight: 15, group: "Supplementary" },
];

export default function Workout() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>(testExercises);

  useEffect(() => {
    navigation.setOptions({ title: `Workout ${id}` });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {exercises.map((exercise) => (
        <Exercise
          id={exercise.id}
          key={exercise.id}
          name={exercise.name}
          weight={exercise.weight}
          group={exercise.group}
        />
      ))}
      <Link href={"/"} asChild>
        <Pressable style={styles.newExerciseButton}>
          <AntDesign name="plus" size={24} color="black" />
        </Pressable>
      </Link>
    </ScrollView>
  );
}

function Exercise({ id, name, weight, group }: Exercise) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isBarbell, setIsBarbell] = useState<boolean>(false);
  const [roundStep, setRoundStep] = useState<number>(0);

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseTopBar}>
        <ExerciseTitleBlock name={name} weight={weight} group={group} />
        <Pressable
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <AntDesign name="up" size={16} color="black" />
          ) : (
            <AntDesign name="down" size={16} color="black" />
          )}
        </Pressable>
      </View>
      {isExpanded && (
        <View style={styles.percentagesDropdown}>
          <Text style={{ textAlign: "center", marginBottom: 16, fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Working Max: </Text>
            <Text>{weight}</Text>
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Percentages:
          </Text>
          <PercentagesList
            weight={weight}
            isBarbell={isBarbell}
            roundStep={roundStep}
            style={{ marginBottom: 16 }}
          />
          {roundStep > 0 ? (
            <Text
              style={{
                fontStyle: "italic",
                marginBottom: 32,
                textAlign: "center",
              }}
            >
              Rounding to intervals of {roundStep}
            </Text>
          ) : (
            <Text
              style={{
                fontStyle: "italic",
                marginBottom: 32,
                textAlign: "center",
              }}
            >
              Not rounding
            </Text>
          )}
          <Button
            title="See Barbell Weights"
            onPress={() => setIsBarbell(!isBarbell)}
            color={isBarbell ? "slategrey" : ""}
          />
          <RoundStepSelector
            selectedValue={roundStep}
            onValueChange={(itemValue) => setRoundStep(itemValue)}
          />
        </View>
      )}
    </View>
  );
}

function ExerciseTitleBlock({
  name,
  weight,
  group,
}: {
  name: string;
  weight: number;
  group: string;
}) {
  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>{name}</Text>
      <View>
        <Text style={{ fontStyle: "italic" }}>
          <Text style={{ fontWeight: "bold" }}>Group: </Text>
          <Text>{group}</Text>
        </Text>
      </View>
    </View>
  );
}

function RoundStepSelector({
  selectedValue,
  onValueChange,
}: {
  selectedValue: number | undefined;
  onValueChange: (itemValue: number, itemIndex: number) => void | undefined;
}) {
  const [isPicking, setIsPicking] = useState<boolean>(false);

  return (
    <>
      <Button
        title="Select Round Step"
        onPress={() => setIsPicking(!isPicking)}
        color={isPicking ? "slategrey" : ""}
      />
      {isPicking && (
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
          <Picker.Item label="None" value={0} />
          <Picker.Item label="2.5" value={2.5} />
          <Picker.Item label="5" value={5} />
          <Picker.Item label="10" value={10} />
        </Picker>
      )}
    </>
  );
}

function PercentagesList({
  weight,
  isBarbell,
  roundStep,
  style,
}: {
  weight: number;
  isBarbell: boolean;
  roundStep: number;
  style?: StyleProp<ViewStyle>;
}) {
  const percentages: number[] = [
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
    100,
  ];

  function getFinalWeight(weight: number, percentage: number) {
    let finalWeight = weight * (percentage / 100);
    if (isBarbell) {
      finalWeight -= 45;
      finalWeight /= 2;
    }
    if (roundStep > 0) {
      finalWeight = round(finalWeight, roundStep);
    }
    return finalWeight < 0 ? 0 : finalWeight;
  }

  function round(n: number, interval: number) {
    return Math.ceil(n / interval) * interval;
  }

  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        },
        style,
      ]}
    >
      <View>
        {percentages.slice(0, percentages.length / 2).map((percentage) => (
          <View
            key={percentage}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <Text style={{ fontWeight: "bold", width: 35 }}>
              {percentage}:{" "}
            </Text>
            <Text>{getFinalWeight(weight, percentage).toFixed(1)}</Text>
          </View>
        ))}
      </View>
      <View>
        {percentages.slice(percentages.length / 2).map((percentage) => (
          <View
            key={percentage}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <Text style={{ fontWeight: "bold", width: 35 }}>
              {percentage}:{" "}
            </Text>
            <Text>{getFinalWeight(weight, percentage).toFixed(1)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

async function getExercises(db: SQLiteDatabase) {
  db.runAsync(
    "SELECT * FROM exercises_test INNER JOIN workouts_test ON workout_id = workouts_test.id",
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: "white",
    padding: 24,
    marginBottom: 16,
  },
  exerciseTopBar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exercise: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    maxWidth: "85%",
  },
  expandButton: {
    paddingLeft: 16,
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  percentagesDropdown: {
    marginTop: 32,
  },
  newExerciseButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "dashed",
  },
});
