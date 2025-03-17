import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

export default function TaskListScreen() {
    const pickerContainerRef = useRef(null); // Utilisation de useRef ici

    const [task, setTask] = useState("");
    const [category, setCategory] = useState("");
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([
        { name: "Travail", color: "#FF5733" },
        { name: "Personnel", color: "#33FF57" },
        { name: "Urgent", color: "#FF33F6" },
    ]);
    const [newCategory, setNewCategory] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("#000000");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [isColorModalVisible, setIsColorModalVisible] = useState(false);

    const addCategory = () => {
        if (newCategory && !categories.some(cat => cat.name === newCategory)) {
            setCategories([...categories, { name: newCategory, color: newCategoryColor }]);
            setNewCategory("");
            setNewCategoryColor("#000000");
            setIsModalVisible(false);
        }
    };

    const addTask = () => {
        if (task && selectedCategory) {
            setTasks([
                ...tasks,
                { id: Date.now(), text: task, category: selectedCategory, isChecked: false },
            ]);
            setTask("");
            setSelectedCategory("");
        }
    };

    const toggleTaskCheck = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, isChecked: !task.isChecked } : task
            )
        );
    };

    // Fonction pour vérifier si toutes les tâches sont terminées
    useEffect(() => {
        if (tasks.every((task) => task.isChecked)) {
            Alert.alert("Félicitations 🎉 !", "Vous avez terminé toutes vos tâches !");
        }
    }, [tasks]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📋 Liste de tâches</Text>

            {/* Sélectionner ou ajouter une catégorie */}
            <View style={styles.categoryContainer}>
                <Text style={styles.subTitle}>Sélectionner une catégorie</Text>
                <TouchableOpacity style={styles.button} onPress={() => setIsCategoryModalVisible(true)}>
                    <Text style={styles.buttonText}>Choisir une catégorie</Text>
                </TouchableOpacity>
            </View>

            {/* Modal pour sélectionner une catégorie */}
            <Modal visible={isCategoryModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sélectionner une catégorie</Text>
                        {categories.map((cat, index) => (
                            <TouchableOpacity key={index} onPress={() => {
                                setSelectedCategory(cat.name);
                                setIsCategoryModalVisible(false);
                            }}>
                                <Text style={[styles.categoryItem, { color: cat.color }]}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setIsCategoryModalVisible(false);
                            setIsModalVisible(true);
                        }}>
                            <Text style={styles.buttonText}>Créer une nouvelle catégorie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setIsCategoryModalVisible(false)}>
                            <Text style={styles.buttonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal pour ajouter une nouvelle catégorie */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ajouter une catégorie</Text>
                        <TextInput
                            style={styles.input}
                            value={newCategory}
                            onChangeText={setNewCategory}
                            placeholder="Nom de la catégorie"
                        />
                        <TouchableOpacity style={styles.button} onPress={() => setIsColorModalVisible(true)}>
                            <Text style={styles.buttonText}>Choisir une couleur</Text>
                        </TouchableOpacity>

                        {/* Modal pour choisir la couleur */}
                        <Modal visible={isColorModalVisible} animationType="slide" transparent={true}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Choisir la couleur</Text>
                                    <ColorPicker
                                        onColorSelected={color => {
                                            setNewCategoryColor(color);
                                            setIsColorModalVisible(false);
                                        }}
                                        sliderComponent={Slider}
                                        style={{ height: 200, width: 200 }}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={() => setIsColorModalVisible(false)}>
                                        <Text style={styles.buttonText}>Fermer</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <TouchableOpacity style={styles.button} onPress={addCategory}>
                            <Text style={styles.buttonText}>Ajouter catégorie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.buttonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Text style={styles.selectedCategoryText}>Catégorie sélectionnée : {selectedCategory}</Text>

            <TextInput
                style={styles.input}
                value={task}
                onChangeText={setTask}
                placeholder="Ajouter une tâche"
            />
            <TouchableOpacity style={styles.button} onPress={addTask}>
                <Text style={styles.buttonText}>Ajouter tâche</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.taskContainer,
                            { backgroundColor: categories.find(cat => cat.name === item.category)?.color || "#ffffff" },
                        ]}
                    >
                        <TouchableOpacity onPress={() => toggleTaskCheck(item.id)}>
                            <View style={[styles.checkbox, item.isChecked && styles.checked]}>
                                {item.isChecked && <Text style={styles.checkmark}>✔️</Text>}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.taskText}>{item.text}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: "100%",
    },
    categoryContainer: {
        marginTop: 20,
    },
    categoryItem: {
        fontSize: 16,
        marginVertical: 5,
    },
    selectedCategoryText: {
        fontSize: 16,
        color: "#333",
        marginTop: 10,
    },
    taskContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    taskText: {
        fontSize: 18,
        flex: 1,
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#333",
        alignItems: "center",
        justifyContent: "center",
    },
    checked: {
        backgroundColor: "#33FF57",
    },
    checkmark: {
        fontSize: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#2d4c6c",  // Couleur générique pour le fond des boutons
        color: "#fff",  // Couleur du texte du bouton
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    },
});


