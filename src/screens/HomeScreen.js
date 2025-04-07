// src/screens/HomeScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';

export default function HomeScreen({ navigation }) {
  const { getGroupsForCurrentUser, initializeState, isLoading, currentUser, getTotalBalance } = useStore();

  useEffect(() => {
    initializeState();
  }, []);

  const groups = getGroupsForCurrentUser();
  const totalBalance = getTotalBalance(currentUser?.id);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate('GroupDetails', { 
        groupId: item.id,
        groupName: item.name 
      })}
    >
      <View style={styles.groupContent}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#6200EE" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Optional: Show total balance if implementing that bonus */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={[
          styles.balanceAmount, 
          totalBalance > 0 ? styles.positive : totalBalance < 0 ? styles.negative : styles.neutral
        ]}>
          {totalBalance > 0 ? `You are owed $${totalBalance.toFixed(2)}` : 
           totalBalance < 0 ? `You owe $${Math.abs(totalBalance).toFixed(2)}` : 
           'You are all settled up!'}
        </Text>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No groups yet. Create your first group!</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  positive: {
    color: '#2E7D32',
  },
  negative: {
    color: '#C62828',
  },
  neutral: {
    color: '#424242',
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});