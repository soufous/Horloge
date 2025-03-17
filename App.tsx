import React from "react";
import { NavigationContainer } from "@react-navigation/native"; // Import de NavigationContainer
import Layout from "./app/_layout"; // Import du layout qui contient la navigation

export default function App() {
    return (
        <NavigationContainer> {/* NavigationContainer englobe toute la navigation */}
            <Layout /> {/* Ton layout avec les écrans */}
        </NavigationContainer>
    );
}
