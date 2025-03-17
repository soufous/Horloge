import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";

type Alarm = {
    id: number;
    time: string;
    active: boolean;
    name: string;
};

export default function AlarmScreen() {
    const [alarmTime, setAlarmTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [alarmName, setAlarmName] = useState("");
    const [alarms, setAlarms] = useState<Alarm[]>([]);

    // Fonction pour afficher le DatePicker
    const showPicker = () => {
        setShowDatePicker(true);
    };

    // Fonction pour gérer la sélection de l'heure
    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || alarmTime;
        setAlarmTime(currentDate);
    };

    // Fonction pour enregistrer une alarme
    const handleAddAlarm = () => {
        if (alarmName.trim() === "") {
            alert("Veuillez donner un nom à l'alarme");
            return;
        }

        const newAlarm: Alarm = {
            id: Date.now(),
            time: alarmTime.toLocaleTimeString(),
            active: true,
            name: alarmName,
        };
        setAlarms([...alarms, newAlarm]);
        setAlarmName(""); // Réinitialiser le champ de texte du nom de l'alarme
        setShowDatePicker(false); // Fermer le DatePicker après enregistrement
    };

    // Fonction pour activer/désactiver une alarme
    const toggleAlarm = (id: number) => {
        setAlarms((prevAlarms) =>
            prevAlarms.map((alarm) =>
                alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
            )
        );
    };

    // Fonction pour supprimer une alarme
    const handleDeleteAlarm = (id: number) => {
        setAlarms((prevAlarms) => prevAlarms.filter((alarm) => alarm.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⏰ Alarme</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom de l'alarme"
                value={alarmName}
                onChangeText={(text) => setAlarmName(text)}
            />

            <TouchableOpacity style={styles.button} onPress={showPicker}>
                <Text style={styles.buttonText}>Sélectionner l'heure de l'alarme</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <View>
                    <DateTimePicker
                        value={alarmTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={handleDateChange}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleAddAlarm}>
                        <Text style={styles.buttonText}>Enregistrer</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={styles.timeText}>Alarme à : {alarmTime.toLocaleTimeString()}</Text>

            <FlatList
                data={alarms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.alarmItem,
                            !item.active && styles.alarmItemInactive,
                        ]}
                    >
                        <Text
                            style={[
                                item.active ? styles.alarmTextActive : styles.alarmTextInactive,
                            ]}
                        >
                            {item.name} à {item.time}
                        </Text>

                        <Switch
                            value={item.active}
                            onValueChange={() => toggleAlarm(item.id)}
                        />

                        <TouchableOpacity onPress={() => handleDeleteAlarm(item.id)}>
                            <Icon name="trash" size={20} color="#FF0000" />
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
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "80%",
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    timeText: {
        fontSize: 18,
        marginVertical: 10,
    },
    alarmItem: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        width: "100%", // Augmenter la largeur des éléments dans la liste
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    alarmItemInactive: {
        backgroundColor: "#d3d3d3",
    },
    alarmTextActive: {
        fontSize: 16,
        color: "#000",
    },
    alarmTextInactive: {
        fontSize: 16,
        color: "#888",
    },
    button: {
        backgroundColor: "#2d4c6c",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
    },

});
