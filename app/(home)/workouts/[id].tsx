import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function Workout() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({ title: `Workout ${id}` });
  }, [navigation]);

  return (
    <View>
      <Text>Workout {id}</Text>
    </View>
  );
}
