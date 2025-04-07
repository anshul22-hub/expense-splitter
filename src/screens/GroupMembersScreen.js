// src/screens/GroupMembersScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import useStore from '../store/useStore';

export default function GroupMembersScreen({ route }) {
  const { groupId } = route.params;
  const { getGroupById, getUserById } = useStore();
  
  const group = getGroupById(groupId);
  const members = group.members.map(userId => getUserById(userId));

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberCard}>
      <Text style={styles.memberAvatar}>{item.avatar}</Text>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Group Members</Text>
            <Text style={styles.memberCount}>
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  memberCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  memberAvatar: {
    fontSize: 32,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});