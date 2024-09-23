import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function EmployeeItem({ employee, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(employee.name);
  const [editedEmail, setEditedEmail] = useState(employee.email);
  const [editedAge, setEditedAge] = useState(employee.age.toString());

  const handleUpdate = async () => {
    try {
      const employeeRef = doc(db, 'employees', employee.id);
      await updateDoc(employeeRef, {
        name: editedName,
        email: editedEmail,
        age: parseInt(editedAge, 10),
      });
      onUpdate({ ...employee, name: editedName, email: editedEmail, age: parseInt(editedAge, 10) });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating employee: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'employees', employee.id));
      onDelete(employee.id);
    } catch (error) {
      console.error('Error deleting employee: ', error);
    }
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={editedName}
          onChangeText={setEditedName}
        />
        <TextInput
          style={styles.input}
          value={editedEmail}
          onChangeText={setEditedEmail}
        />
        <TextInput
          style={styles.input}
          value={editedAge}
          onChangeText={setEditedAge}
          keyboardType="numeric"
        />
        <Button title="Save" onPress={handleUpdate} />
        <Button title="Cancel" onPress={() => setIsEditing(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Name: {employee.name}</Text>
      <Text>Email: {employee.email}</Text>
      <Text>Age: {employee.age}</Text>
      <Button title="Edit" onPress={() => setIsEditing(true)} />
      <Button title="Delete" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});