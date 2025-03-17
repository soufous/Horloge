import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons"; // Icônes

type Timer = {
    id: number;
    duration: number; // Durée en secondes
    active: boolean;
    timeLeft: number;
    formattedTime: string; // Format h:m:s
    intervalId: any; // ID du setInterval pour gérer la pause/reprise
};

export default function TimerScreen() {
    const [timersInProgress, setTimersInProgress] = useState<Timer[]>([]); // Liste des minuteries en cours
    const [timersRecent, setTimersRecent] = useState<Timer[]>([]); // Liste des minuteries récentes
    const [currentDuration, setCurrentDuration] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const showPicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setCurrentDuration(selectedDate);
        }
        // Ne pas fermer immédiatement, attendre une action utilisateur pour fermer le picker
    };

    const handleConfirmDate = () => {
        setShowDatePicker(false); // Fermer le DateTimePicker après confirmation
    };


    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const handleAddTimer = () => {
        const durationInSeconds = currentDuration.getHours() * 3600 + currentDuration.getMinutes() * 60 + currentDuration.getSeconds();
        const newTimer: Timer = {
            id: Date.now(),
            duration: durationInSeconds,
            active: true, // Activer directement le minuteur
            timeLeft: durationInSeconds,
            formattedTime: formatTime(durationInSeconds),
            intervalId: null, // Initialiser sans intervalle
        };

        // Ajouter la minuterie en cours
        setTimersInProgress((prevTimers) => [...prevTimers, newTimer]);
        setCurrentDuration(new Date(0)); // Réinitialiser la durée après ajout

        // Démarrer immédiatement la minuterie après l'ajout
        startTimer(newTimer);
    };

    const startTimer = (timer: Timer) => {
        const intervalId = setInterval(() => {
            setTimersInProgress((prevTimers) =>
                prevTimers.map((t) =>
                    t.id === timer.id && t.timeLeft > 0
                        ? { ...t, timeLeft: t.timeLeft - 1, formattedTime: formatTime(t.timeLeft - 1) }
                        : t
                )
            );
        }, 1000);

        // Sauvegarder l'ID de l'intervalle pour pouvoir arrêter le timer en pause
        setTimersInProgress((prevTimers) =>
            prevTimers.map((t) =>
                t.id === timer.id ? { ...t, intervalId } : t
            )
        );
    };

    const handlePauseTimer = (id: number) => {
        const timer = timersInProgress.find((timer) => timer.id === id);
        if (timer && timer.intervalId) {
            // Mettre en pause la minuterie
            clearInterval(timer.intervalId);
            setTimersInProgress((prevTimers) =>
                prevTimers.map((t) =>
                    t.id === id ? { ...t, active: false, intervalId: null } : t
                )
            );
        }
    };

    const handleRestartTimer = (id: number) => {
        const timer = timersInProgress.find((timer) => timer.id === id);
        if (timer && timer.timeLeft > 0) {
            // Redémarrer le minuteur
            startTimer(timer);
            setTimersInProgress((prevTimers) =>
                prevTimers.map((t) =>
                    t.id === id ? { ...t, active: true } : t
                )
            );
        }
    };

    const handleDeleteTimer = (id: number, isInProgress: boolean) => {
        if (isInProgress) {
            setTimersInProgress((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
        } else {
            setTimersRecent((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
        }
        const timer = timersInProgress.find((timer) => timer.id === id);
        if (timer && timer.intervalId) {
            clearInterval(timer.intervalId); // Nettoyage de l'intervalle
        }
    };

    const handleMoveToRecent = (id: number) => {
        const completedTimer = timersInProgress.find((timer) => timer.id === id);
        if (completedTimer) {
            // Supprimer de la liste des minuteries en cours et l'ajouter aux récentes
            setTimersInProgress((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
            setTimersRecent((prevTimers) => [...prevTimers, completedTimer]);
        }
    };

    const checkCompletedTimers = () => {
        timersInProgress.forEach((timer) => {
            if (timer.timeLeft === 0) {
                handleMoveToRecent(timer.id); // Si le minuteur est terminé, le déplacer dans les récentes
            }
        });
    };

    useEffect(() => {
        // Mise à jour des minuteries toutes les secondes
        const interval = setInterval(checkCompletedTimers, 1000);
        return () => clearInterval(interval); // Nettoyage à la destruction du composant
    }, [timersInProgress]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⏳ Minuteur</Text>

            <TouchableOpacity style={styles.customButton} onPress={showPicker}>
                <Text style={styles.buttonText}>Sélectionner la durée</Text>
            </TouchableOpacity>


            {showDatePicker && (
                <DateTimePicker
                    value={currentDuration}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.text}>
                Durée : {currentDuration.getHours()} h {currentDuration.getMinutes()} m {currentDuration.getSeconds()} s
            </Text>

            <TouchableOpacity
                style={[styles.customButton, currentDuration.getTime() === 0 && styles.disabledButton]}
                onPress={handleAddTimer}
                disabled={currentDuration.getTime() === 0}
            >
                <Text style={styles.buttonText}>Ajouter Minuteur</Text>
            </TouchableOpacity>

            <Text style={styles.subTitle}>Minuteries en cours</Text>
            <FlatList
                data={timersInProgress}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.timerItem}>
                        <Text style={styles.timerText}>
                            {item.timeLeft > 0 ? `Temps restant: ${item.formattedTime}` : "Temps écoulé!"}
                        </Text>

                        <View style={styles.buttons}>
                            {item.active ? (
                                <TouchableOpacity onPress={() => handlePauseTimer(item.id)}>
                                    <Ionicons name="pause-circle-outline" size={30} color="orange" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => handleRestartTimer(item.id)}>
                                    <Ionicons name="play-circle-outline" size={30} color="green" />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => handleDeleteTimer(item.id, true)}>
                                <Ionicons name="trash-outline" size={30} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <Text style={styles.subTitle}>Minuteries récentes</Text>
            <FlatList
                data={timersRecent}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.timerItem}>
                        <Text style={styles.timerText}>Temps écoulé: {item.formattedTime}</Text>

                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={() => handleRestartTimer(item.id)}>
                                <Ionicons name="reload-circle-outline" size={30} color="blue" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteTimer(item.id, false)}>
                                <Ionicons name="trash-outline" size={30} color="red" />
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
    },
    text: {
        fontSize: 18,
        marginVertical: 10,
    },
    timerItem: {
        backgroundColor: "#e0e0e0",
        padding: 10,
        marginBottom: 15,
        width: "100%",
        borderRadius: 5,
        flexDirection: "row", // Alignement des éléments horizontalement
        justifyContent: "space-between", // Espacement entre le texte et les boutons
        alignItems: "center", // Aligner les éléments au centre verticalement
    },
    timerText: {
        fontSize: 18,
        marginRight: 10, // Ajouter un peu d'espace à droite du texte pour ne pas que ça touche les boutons
        flex: 1, // Le texte prend l'espace disponible à gauche
    },
    buttons: {
        flexDirection: "row", // Disposer les boutons sur la même ligne
        justifyContent: "space-between", // Espacement uniforme entre les boutons
        width: "35%", // Limiter la largeur des boutons
        alignItems: "center", // Centrer verticalement les icônes
    },
    customButton: {
        backgroundColor: '#2d4c6c', // Couleur de fond
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30, // Bordure arrondie
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, // Espacement vertical
    },
    buttonText: {
        color: 'white', // Couleur du texte
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#9bb5cf', // Couleur de fond pour le bouton désactivé
    },
});
