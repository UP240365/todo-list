import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { Task } from "../types/task";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTask,
  getTaskById
} from "../services/api";

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchId, setSearchId] = useState<string>("");

  const loadTasks = async (): Promise<void> => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("El título es obligatorio");
      return;
    }

    try {
      if (editingId) {
        const current = tasks.find(t => t.id === editingId);

        await updateTask(editingId, {
          title,
          description,
          completed: current?.completed ?? 0
        });
        setEditingId(null);
      } else {
        await createTask({ title, description });
      }

      setTitle("");
      setDescription("");
      loadTasks();
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 To-Do List</Text>

      {/* FORMULARIO */}
      <View style={styles.card}>
        <TextInput
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Buscar por ID"
          value={searchId}
          onChangeText={setSearchId}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={async () => {
            if (!searchId) return;

            try {
              const task = await getTaskById(Number(searchId));
              setTasks([task]); 
            } catch (error) {
              alert("Tarea no encontrada");
            }
          }}
        >
          
          <Text style={{ color: "white" }}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSearchId("");
              loadTasks();
            }}
          >
            <Text style={{ color: "white" }}>Mostrar todas</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.mainBtn} onPress={handleSubmit}>
          <Text style={styles.mainBtnText}>
            {editingId ? "Actualizar tarea" : "Agregar tarea"}
          </Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* LISTA */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={{ flex: 1 }}>
              <Text
                style={
                  item.completed === 1
                    ? styles.completedTitle
                    : styles.title
                }
              >
                {item.title}
              </Text>

              <Text style={styles.description}>
                {item.description}
              </Text>
            </View>

            {/* BOTONES */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={async () => {
                  await toggleTask(item.id);
                  loadTasks();
                }}
              >
                <Text>✔</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={async () => {
                  const res = await getTaskById(item.id);
                  const task = res.data || res;

                  setTitle(task.title);
                  setDescription(task.description);
                  setEditingId(item.id);
                }}
              >
                <Text>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={async () => {
                  await deleteTask(item.id);
                  loadTasks();
                }}
              >
                <Text style={{ color: "white" }}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    padding: 20,
    paddingTop: 50
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fafafa"
  },

  mainBtn: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center"
  },

  mainBtnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  taskCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },

  completedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "line-through",
    color: "gray"
  },

  description: {
    color: "#666",
    marginTop: 4
  },

  actions: {
    flexDirection: "row",
    gap: 8
  },

  actionBtn: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 8
  },

  deleteBtn: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 8
  },

  searchBtn: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center"
  },

  resetBtn: {
    backgroundColor: "#2ecc71",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center"
  },
});