// src/screens/GroupDetailsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import useStore from '../store/useStore';

export default function GroupDetailsScreen({ route, navigation }) {
  const { groupId } = route.params;
  const { 
    getGroupById, 
    getExpensesForGroup, 
    getUserById, 
    currentUser,
    getBalanceForUserInGroup
  } = useStore();

  const group = getGroupById(groupId);
  const expenses = getExpensesForGroup(groupId);
  const userBalance = getBalanceForUserInGroup(currentUser.id, groupId);

  const handleViewMembers = () => {
    navigation.navigate('GroupMembers', { groupId });
  };

  const renderExpenseItem = ({ item }) => {
    const paidByUser = getUserById(item.paidBy);
    
    return (
      <View style={styles.expenseCard}>
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
        </View>
        
        <Text style={styles.expenseDescription}>{item.description}</Text>
        
        <View style={styles.expenseFooter}>
          <Text style={styles.expensePaidBy}>
            Paid by {paidByUser.name} • {format(new Date(item.createdAt), 'MMM d, yyyy')}
          </Text>
          
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Group Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <TouchableOpacity 
            style={styles.membersButton}
            onPress={handleViewMembers}
          >
            <Ionicons name="people-outline" size={16} color="#6200EE" />
            <Text style={styles.membersButtonText}>Members</Text>
          </TouchableOpacity>
        </View>
        <Text style={[
          styles.balanceAmount, 
          userBalance > 0 ? styles.positive : userBalance < 0 ? styles.negative : styles.neutral
        ]}>
          {userBalance > 0 ? `You are owed $${userBalance.toFixed(2)}` : 
           userBalance < 0 ? `You owe $${Math.abs(userBalance).toFixed(2)}` : 
           'You are all settled up!'}
        </Text>
      </View>

      {/* Expenses List */}
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expenses</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No expenses yet. Add your first expense!</Text>
          </View>
        }
      />

      {/* Add Expense FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense', { groupId })}
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
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  membersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  membersButtonText: {
    fontSize: 14,
    color: '#6200EE',
    marginLeft: 4,
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
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  expenseCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expensePaidBy: {
    fontSize: 12,
    color: '#666',
  },
  categoryTag: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#424242',
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