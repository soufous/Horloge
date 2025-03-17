import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import IndexScreen from "./index"; // L'écran principal
import ClockScreen from "./clock";
import AlarmScreen from "./alarm";
import TimerScreen from "./timer";
import StopwatchScreen from "./stopwatch";
import TaskListScreen from "./tasks";
import PomodoroScreen from "./pomodoro";

export type RootStackParamList = {
  Home: undefined;
  Clock: undefined;
  Alarm: undefined;
  Timer: undefined;
  Stopwatch: undefined;
  Tasks: undefined;
  Pomodoro: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Layout() {
  return (
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#333232" }, headerTintColor: "#fff" }}>
        <Stack.Screen name="Home" component={IndexScreen} />
        <Stack.Screen name="Clock" component={ClockScreen} />
        <Stack.Screen name="Alarm" component={AlarmScreen} />
        <Stack.Screen name="Timer" component={TimerScreen} />
        <Stack.Screen name="Stopwatch" component={StopwatchScreen} />
          <Stack.Screen name="Pomodoro" component={PomodoroScreen} />
        <Stack.Screen name="Tasks" component={TaskListScreen} />

      </Stack.Navigator>
  );
}

