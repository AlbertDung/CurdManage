import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar, TouchableOpacity, Modal, TextInput,Dimensions } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AddEmployeeForm from './Screens/AddEmployeeForm';
import EmployeeItem from './Screens/EmployeeItem';
import ErrorMessage from './Screens/ErrorMessage';
import { Icon } from 'react-native-elements';
const { width, height } = Dimensions.get('window');

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(false);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const handleDeleteEmployee = (deletedEmployeeId) => {
    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== deletedEmployeeId));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, darkMode && styles.darkBackground]}>
        <ActivityIndicator size="large" color={darkMode ? "#FFFFFF" : "#007AFF"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkBackground]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={darkMode ? "#1C1C1E" : "#FFFFFF"} />
      <View style={[styles.header, darkMode && styles.darkHeader]}>
        <Text style={[styles.title, darkMode && styles.darkText]}>HR Management</Text>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.modeToggle}>
          <Icon name={darkMode ? "sun" : "moon"} type="feather" color={darkMode ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, darkMode && styles.darkSearchInput]}
          placeholder="Search employees..."
          placeholderTextColor={darkMode ? "#999999" : "#666666"}
          value={searchQuery}
          onChangeText={setSearchQuery }
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Icon name="plus" type="feather" color={darkMode ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, darkMode && styles.darkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, darkMode && styles.darkText]}>Add Employee</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="x" type="feather" color={darkMode ? "#FFFFFF" : "#000000"} />
              </TouchableOpacity>
            </View>
            <AddEmployeeForm onAddEmployee={handleAddEmployee} darkMode={darkMode} />
          </View>
        </View>
      </Modal>

      {error && <ErrorMessage message={error} />}
      <FlatList
        data={filteredEmployees}
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
  darkBackground: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 4,
  },
  darkHeader: {
    backgroundColor: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkText: {
    color: '#FFFFFF',
  },
  modeToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  darkSearchInput: {
    borderColor: '#333333',
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
  addButton: {
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
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

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#333333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#FFFFFF',
  },
});