import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function IndexScreen({ navigation }: { navigation: any }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>⏳ Projet Portfolio - Horloge ⏳</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Clock")}>
                    <Text style={styles.buttonText}>🕰️ Horloge</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Alarm")}>
                    <Text style={styles.buttonText}>⏰ Alarme</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Timer")}>
                    <Text style={styles.buttonText}>⏳ Minuteur</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Stopwatch")}>
                    <Text style={styles.buttonText}>⏱️ Chronomètre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tasks")}>
                    <Text style={styles.buttonText}>📋 Liste de tâches</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Pomodoro")}>
                    <Text style={styles.buttonText}>🍅 Pomodoro</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1d0d0", // Couleur de fond de la page
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    buttonContainer: {
        width: "100%",
        gap: 10,
    },
    button: {
        backgroundColor: "#38858a", // Couleur de fond des boutons
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});


