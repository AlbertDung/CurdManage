import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AddEmployeeForm from './Screens/AddEmployeeForm';
import EmployeeItem from './Screens/EmployeeItem';
import ErrorMessage from './Screens/ErrorMessage';

import { Card } from 'react-native-elements';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const employeeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeeList);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const handleDeleteEmployee = (deletedEmployeeId) => {
    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== deletedEmployeeId));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="black" />
      <View style={styles.header}>
        <Text style={styles.title}>Employee Management</Text>
      </View>
      <Card containerStyle={styles.formCard}>
        <AddEmployeeForm onAddEmployee={handleAddEmployee} />
      </Card>
      {error && <ErrorMessage message={error} />}
      <FlatList
        data={employees}
        renderItem={({ item }) => (
          <EmployeeItem
            employee={item}
            onUpdate={handleUpdateEmployee}
            onDelete={handleDeleteEmployee}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  formCard: {
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
});