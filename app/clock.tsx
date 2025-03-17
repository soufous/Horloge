import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment-timezone"; // Librairie pour gérer le fuseau horaire
import "moment/locale/fr"; // Importation de la locale française

export default function ClockScreen() {
    const [currentTime, setCurrentTime] = useState(moment().tz("Europe/Paris").format("HH:mm:ss"));
    const [currentDate, setCurrentDate] = useState(moment().tz("Europe/Paris").locale("fr").format("dddd, MMMM D, YYYY"));
    const [location, setLocation] = useState("Paris, France");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = moment().tz("Europe/Paris").locale("fr");
            setCurrentTime(now.format("HH:mm:ss"));
            setCurrentDate(now.format("dddd, MMMM D, YYYY"));
        }, 1000);

        return () => clearInterval(timer); // Cleanup l'intervalle quand le composant est démonté
    }, []);

    const renderClockHands = () => {
        const now = moment().tz("Europe/Paris");
        const hours = now.hours();
        const minutes = now.minutes();
        const seconds = now.seconds();

        const secondsAngle = (seconds / 60) * 360;
        const minutesAngle = (minutes + seconds / 60) * (360 / 60);
        const hoursAngle = (hours % 12 + minutes / 60) * (360 / 12);

        return (
            <>
                <View style={[styles.hand, styles.secondHand, { transform: [{ rotate: `${secondsAngle}deg` }] }]} />
                <View style={[styles.hand, styles.minuteHand, { transform: [{ rotate: `${minutesAngle}deg` }] }]} />
                <View style={[styles.hand, styles.hourHand, { transform: [{ rotate: `${hoursAngle}deg` }] }]} />
            </>
        );
    };

    const renderNumbers = () => {
        const numbers = [];
        for (let i = 1; i <= 12; i++) {
            const angle = (i / 12) * 360;
            const x = 80 * Math.sin((angle * Math.PI) / 180);
            const y = -80 * Math.cos((angle * Math.PI) / 180);
            numbers.push(
                <View key={i} style={[styles.numberContainer, { transform: [{ translateX: x }, { translateY: y }] }]}>
                    <Text style={styles.number}>{i}</Text>
                </View>
            );
        }
        return <>{numbers}</>;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🕰️ Horloge</Text>

            {/* Affichage de l'horloge analogique */}
            <View style={styles.clock}>
                {renderClockHands()}
                {renderNumbers()}
                <View style={styles.centerCircle} />
            </View>

            {/* Affichage de l'heure en grand */}
            <Text style={styles.time}>{currentTime}</Text>

            {/* Affichage de la date */}
            <Text style={styles.date}>{currentDate}</Text>

            {/* Affichage du lieu */}
            <Text style={styles.location}>{location}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f0f0f0", // Ajouter une couleur de fond claire
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    clock: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 10,
        borderColor: "#000", // Couleur du bord de l'horloge
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginBottom: 20,
    },
    hand: {
        position: "absolute",
        backgroundColor: "#000", // Couleur des aiguilles
        transformOrigin: "bottom", // Le point de rotation
    },
    hourHand: {
        width: 6,
        height: 50,
        bottom: 90, // Ajusté pour centrer l'aiguille des heures
        borderRadius: 3,
    },
    minuteHand: {
        width: 4,
        height: 70,
        bottom: 90, // Ajusté pour centrer l'aiguille des minutes
        borderRadius: 2,
    },
    secondHand: {
        width: 2,
        height: 80,
        bottom: 90, // Ajusté pour centrer l'aiguille des secondes
        borderRadius: 1,
        backgroundColor: "red", // Couleur de l'aiguille des secondes
    },
    centerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#000", // Couleur du centre de l'horloge
        position: "absolute",
    },
    numberContainer: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    number: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000", // Couleur des chiffres
    },
    time: {
        fontSize: 60, // Taille très grande pour l'heure
        fontWeight: "bold",
        color: "#000", // Couleur de texte noir pour l'heure
        marginBottom: 10,
    },
    date: {
        fontSize: 24,
        color: "#555", // Couleur grise pour la date
        marginBottom: 5,
    },
    location: {
        fontSize: 18,
        color: "#888", // Couleur plus claire pour le lieu
    },
});


