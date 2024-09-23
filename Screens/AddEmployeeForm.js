import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AddEmployeeForm({ onAddEmployee }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !age.trim()) {
      alert('All fields are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    const ageValue = parseInt(age, 10);
    if (isNaN(ageValue) || ageValue < 18 || ageValue > 100) {
      alert('Please enter a valid age between 18 and 100');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'employees'), {
        name: name.trim(),
        email: email.trim(),
        age: ageValue,
      });
      
      // Use the automatically generated ID from Firestore
      const newEmployee = {
        id: docRef.id,  // This is the auto-generated Firestore document ID
        name: name.trim(),
        email: email.trim(),
        age: ageValue,
      };
      
      onAddEmployee(newEmployee);
      setName('');
      setEmail('');
      setAge('');
    } catch (error) {
      console.error('Error adding employee: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
        containerStyle={styles.input}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        containerStyle={styles.input}
      />
      <Input
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        containerStyle={styles.input}
      />
      <Button
        title="Add Employee"
        onPress={handleSubmit}
        buttonStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
  },
});