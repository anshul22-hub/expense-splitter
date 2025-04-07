// src/screens/CreateGroupScreen.js
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
import useStore from '../store/useStore';

export default function CreateGroupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { users, currentUser, createGroup } = useStore();
  
  // Filter out the current user from the list
  const otherUsers = users.filter(user => user.id !== currentUser.id);
  
  // Track selected members
  const [selectedMembers, setSelectedMembers] = useState({});

  const toggleMember = (userId) => {
    setSelectedMembers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleCreateGroup = () => {
    if (!name.trim()) {
      // Show error for missing name
      alert('Please enter a group name');
      return;
    }

    const memberIds = Object.keys(selectedMembers).filter(id => selectedMembers[id]);
    const groupId = createGroup(name, description, memberIds);
    
    // Navigate to the group details screen
    navigation.replace('GroupDetails', { 
      groupId,
      groupName: name 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Group Name*</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter group name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter group description"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Select Members</Text>
        {otherUsers.map(user => (
          <View key={user.id} style={styles.memberRow}>
            <View style={styles.userInfo}>
              <Text style={styles.avatar}>{user.avatar}</Text>
              <Text style={styles.memberName}>{user.name}</Text>
            </View>
            <Switch
              value={!!selectedMembers[user.id]}
              onValueChange={() => toggleMember(user.id)}
              trackColor={{ false: '#E0E0E0', true: '#B39DDB' }}
              thumbColor={selectedMembers[user.id] ? '#6200EE' : '#F5F5F5'}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleCreateGroup}
      >
        <Text style={styles.buttonText}>Create Group</Text>
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
    height: 100,
    textAlignVertical: 'top',
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