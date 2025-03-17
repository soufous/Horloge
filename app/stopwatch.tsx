import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function StopwatchScreen() {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const startStopwatch = () => {
        setIsRunning(true);
        const id = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);
        setIntervalId(id);
    };

    const stopStopwatch = () => {
        if (intervalId) clearInterval(intervalId);
        setIsRunning(false);
    };

    const resetStopwatch = () => {
        if (intervalId) clearInterval(intervalId);
        setTime(0);
        setIsRunning(false);
    };

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⏱️ Chronomètre</Text>
            <View style={styles.circle}>
                <Text style={styles.time}>{formatTime(time)}</Text>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isRunning ? "#FF4C4C" : "#4CAF50" }]}
                    onPress={isRunning ? stopStopwatch : startStopwatch}
                >
                    <Text style={styles.buttonText}>{isRunning ? "Arrêter" : "Démarrer"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: "#2196F3" }]} onPress={resetStopwatch}>
                    <Text style={styles.buttonText}>Réinitialiser</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    circle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 8,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
    },
    time: {
        fontSize: 50,
        fontWeight: "bold",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
});
