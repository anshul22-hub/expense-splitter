// src/screens/AddExpenseScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Switch
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import {picker} from 'react-native-picker-select';
// import { Picker } from 'react-native-picker-select';
import Picker from 'react-native-picker-select';
import useStore from '../store/useStore';

export default function AddExpenseScreen({ route, navigation }) {
  const { groupId } = route.params;
  const { getGroupById, getUserById, addExpense, users } = useStore();
  
  const group = getGroupById(groupId);
  const groupMembers = group.members.map(userId => getUserById(userId));
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [paidBy, setPaidBy] = useState(groupMembers[0]?.id);
  const [splitType, setSplitType] = useState('equal');
  
  // For split among members
  const [splitMembers, setSplitMembers] = useState(
    groupMembers.reduce((acc, member) => {
      acc[member.id] = true;
      return acc;
    }, {})
  );

  const toggleSplitMember = (userId) => {
    setSplitMembers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleAddExpense = () => {
    if (!title.trim() || !amount || isNaN(parseFloat(amount))) {
      alert('Please enter a valid title and amount');
      return;
    }

    const splitAmong = Object.keys(splitMembers).filter(id => splitMembers[id]);
    
    if (splitAmong.length === 0) {
      alert('Please select at least one member to split with');
      return;
    }

    addExpense(groupId, {
      title,
      description,
      amount,
      category,
      paidBy,
      splitAmong,
      splitType,
    });

    navigation.goBack();
  };

  // Available categories
  const categories = [
    'Food & Drink', 
    'Groceries', 
    'Housing', 
    'Transportation', 
    'Entertainment', 
    'Utilities', 
    'General'
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title*</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter expense title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter expense description"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Amount*</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            {categories.map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Paid By</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paidBy}
            onValueChange={(itemValue) => setPaidBy(itemValue)}
            style={styles.picker}
          >
            {groupMembers.map(member => (
              <Picker.Item key={member.id} label={member.name} value={member.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Split Type</Text>
        <View style={styles.splitTypeContainer}>
          <TouchableOpacity
            style={[
              styles.splitTypeOption,
              splitType === 'equal' && styles.splitTypeSelected
            ]}
            onPress={() => setSplitType('equal')}
          >
            <Text style={splitType === 'equal' ? styles.splitTypeTextSelected : styles.splitTypeText}>
              Equal
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.splitTypeOption,
              splitType === 'custom' && styles.splitTypeSelected
            ]}
            onPress={() => setSplitType('custom')}
          >
            <Text style={splitType === 'custom' ? styles.splitTypeTextSelected : styles.splitTypeText}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Split Among</Text>
        {groupMembers.map(member => (
          <View key={member.id} style={styles.memberRow}>
            <View style={styles.userInfo}>
              <Text style={styles.avatar}>{member.avatar}</Text>
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
            <Switch
              value={!!splitMembers[member.id]}
              onValueChange={() => toggleSplitMember(member.id)}
              trackColor={{ false: '#E0E0E0', true: '#B39DDB' }}
              thumbColor={splitMembers[member.id] ? '#6200EE' : '#F5F5F5'}
            />
          </View>
          // Continuing src/screens/AddExpenseScreen.js
        ))}
        </View>
  
        {/* Custom split UI would go here if splitType === 'custom' */}
        {splitType === 'custom' && (
          <View style={styles.customSplitContainer}>
            <Text style={styles.sectionSubtitle}>Set custom split amounts</Text>
            {groupMembers.map(member => {
              if (!splitMembers[member.id]) return null;
              
              return (
                <View key={member.id} style={styles.customSplitRow}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <TextInput
                    style={styles.customSplitInput}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    // You'd need to implement custom split logic here
                  />
                </View>
              );
            })}
          </View>
        )}
  
        <TouchableOpacity 
          style={styles.button}
          onPress={handleAddExpense}
        >
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 16,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#424242',
    },
    input: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    pickerContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      overflow: 'hidden',
    },
    picker: {
      height: 50,
    },
    splitTypeContainer: {
      flexDirection: 'row',
      backgroundColor: '#E0E0E0',
      borderRadius: 8,
      overflow: 'hidden',
    },
    splitTypeOption: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
    },
    splitTypeSelected: {
      backgroundColor: '#6200EE',
    },
    splitTypeText: {
      color: '#424242',
      fontWeight: '500',
    },
    splitTypeTextSelected: {
      color: 'white',
      fontWeight: '500',
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      fontSize: 24,
      marginRight: 12,
    },
    memberName: {
      fontSize: 16,
    },
    customSplitContainer: {
      marginTop: 8,
      marginBottom: 20,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 12,
    },
    customSplitRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    customSplitInput: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 10,
      width: 100,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      textAlign: 'right',
    },
    button: {
      backgroundColor: '#6200EE',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 32,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });