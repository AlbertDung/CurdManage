import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AddEmployeeForm from './Screens/AddEmployeeForm';
import EmployeeItem from './Screens/EmployeeItem';
import ErrorMessage from './Screens/ErrorMessage';

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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Management</Text>
      <AddEmployeeForm onAddEmployee={handleAddEmployee} />
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});