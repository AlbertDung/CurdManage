import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ErrorMessage({ message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffcccb',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    color: '#d8000c',
  },
});