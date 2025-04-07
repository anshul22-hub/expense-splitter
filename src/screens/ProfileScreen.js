// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useStore from '../store/useStore';

export default function ProfileScreen() {
  const { currentUser, getGroupsForCurrentUser, getTotalBalance } = useStore();
  
  const groups = getGroupsForCurrentUser();
  const totalBalance = getTotalBalance(currentUser?.id);
  
  const groupBalances = groups.map(group => ({
    ...group,
    balance: useStore.getState().getBalanceForUserInGroup(currentUser.id, group.id)
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.avatar}>{currentUser.avatar}</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Overall Summary</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={[
            styles.balanceAmount, 
            totalBalance > 0 ? styles.positive : totalBalance < 0 ? styles.negative : styles.neutral
          ]}>
            ${Math.abs(totalBalance).toFixed(2)}
          </Text>
        </View>
        <Text style={[
          styles.balanceStatus,
          totalBalance > 0 ? styles.positive : totalBalance < 0 ? styles.negative : styles.neutral
        ]}>
          {totalBalance > 0 ? 'You are owed' : totalBalance < 0 ? 'You owe' : 'All settled up'}
        </Text>
      </View>

      <View style={styles.groupsCard}>
        <Text style={styles.sectionTitle}>Group Balances</Text>
        {groupBalances.length > 0 ? (
          groupBalances.map(group => (
            <View key={group.id} style={styles.groupBalanceRow}>
              <Text style={styles.groupName}>{group.name}</Text>
              <View style={styles.groupBalanceInfo}>
                <Text style={[
                  styles.groupBalanceAmount,
                  group.balance > 0 ? styles.positive : group.balance < 0 ? styles.negative : styles.neutral
                ]}>
                  ${Math.abs(group.balance).toFixed(2)}
                </Text>
                <Text style={[
                  styles.groupBalanceStatus,
                  group.balance > 0 ? styles.positive : group.balance < 0 ? styles.negative : styles.neutral
                ]}>
                  {group.balance > 0 ? 'owed to you' : group.balance < 0 ? 'you owe' : 'settled'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>You haven't joined any groups yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  avatar: {
    fontSize: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 16,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceStatus: {
    fontSize: 14,
    textAlign: 'right',
  },
  groupsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  groupBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
  },
  groupBalanceInfo: {
    alignItems: 'flex-end',
  },
  groupBalanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupBalanceStatus: {
    fontSize: 12,
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
  emptyText: {
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
});