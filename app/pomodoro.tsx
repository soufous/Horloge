import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Pour l'icône de suppression

export default function PomodoroScreen() {
    const [time, setTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [mode, setMode] = useState("pomodoro");

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTime((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const switchMode = (newMode) => {
        setIsRunning(false);
        if (newMode === "pomodoro") setTime(25 * 60);
        if (newMode === "shortBreak") setTime(5 * 60);
        if (newMode === "longBreak") setTime(15 * 60);
        setMode(newMode);
    };

    const addTask = () => {
        if (taskInput.trim() !== "") {
            setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
            setTaskInput("");
        }
    };

    const completeTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
        Alert.alert("Félicitations 🎉", "Vous avez terminé la tâche !");
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const backgroundColors = {
        pomodoro: "#ba4949",
        shortBreak: "#38858a",
        longBreak: "#4d7fa2"
    };

    const darkenColor = (color) => {
        const hex = color.replace(/^#/, '');
        const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 30);
        const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 30);
        const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 30);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const activeButtonColor = backgroundColors[mode];
    const buttonColor = darkenColor(activeButtonColor);

    return (
        <View style={[styles.container, { backgroundColor: activeButtonColor }]}>
            <Text style={styles.title}>🍅 Pomodoro</Text>
            <Text style={styles.timer}>
                {`${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`}
            </Text>
            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: mode === "pomodoro" ? buttonColor : darkenColor(activeButtonColor), opacity: mode === "pomodoro" ? 1 : 0.6 }]}
                    onPress={() => switchMode("pomodoro")}
                >
                    <Text style={styles.buttonText}>Pomodoro</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: mode === "shortBreak" ? buttonColor : darkenColor(activeButtonColor), opacity: mode === "shortBreak" ? 1 : 0.6 }]}
                    onPress={() => switchMode("shortBreak")}
                >
                    <Text style={styles.buttonText}>Pause courte</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: mode === "longBreak" ? buttonColor : darkenColor(activeButtonColor), opacity: mode === "longBreak" ? 1 : 0.6 }]}
                    onPress={() => switchMode("longBreak")}
                >
                    <Text style={styles.buttonText}>Pause longue</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.startButton} onPress={() => setIsRunning(!isRunning)}>
                <Text style={styles.buttonText}>{isRunning ? "Pause" : "Démarrer"}</Text>
            </TouchableOpacity>

            {/* Ajout de tâches */}
            <TextInput
                style={styles.input}
                placeholder="Ajouter une tâche..."
                value={taskInput}
                onChangeText={setTaskInput}
                onSubmitEditing={addTask}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <Text style={styles.buttonText}>Ajouter</Text>
            </TouchableOpacity>

            {/* Liste des tâches */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskContainer}>
                        <TouchableOpacity onPress={() => completeTask(item.id)} style={styles.task}>
                            <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                                {item.text}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                            <Ionicons name="close-circle" size={24} color="#000000" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    timer: {
        fontSize: 48,
        marginVertical: 20,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    startButton: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: "#a83c13",
        marginVertical: 10,
    },
    addButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#1b681b",
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        width: "80%",
        marginVertical: 10,
        borderRadius: 5,
    },
    taskContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    task: {
        flex: 1,
    },
    taskText: {
        fontSize: 18,
        paddingLeft: 10,
    },
    completedTask: {
        textDecorationLine: "line-through",
        color: "gray",
    },
    deleteButton: {
        paddingRight: 10,
    },
});
