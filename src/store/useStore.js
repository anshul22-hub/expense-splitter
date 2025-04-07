// src/store/useStore.js
import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

// Load persisted state
const loadPersistedState = async () => {
  try {
    const storedState = await AsyncStorage.getItem('expense-splitter-state');
    return storedState ? JSON.parse(storedState) : null;
  } catch (error) {
    console.error('Error loading persisted state:', error);
    return null;
  }
};

// Save state to AsyncStorage
const persistState = async (state) => {
  try {
    await AsyncStorage.setItem('expense-splitter-state', JSON.stringify(state));
  } catch (error) {
    console.error('Error persisting state:', error);
  }
};

// Mock users (replace with Firebase Auth later if implementing that bonus)
const mockUsers = [
  { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: '👨' },
  { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: '👩' },
  { id: 'currentUser', name: 'You', email: 'you@example.com', avatar: '😎' },
];

const useStore = create((set, get) => ({
  // Initial state
  currentUser: mockUsers.find(user => user.id === 'currentUser'),
  users: mockUsers,
  groups: [],
  expenses: [],
  isLoading: true,

  // Initialize state from AsyncStorage
  initializeState: async () => {
    const persistedState = await loadPersistedState();
    if (persistedState) {
      set({ 
        ...persistedState,
        isLoading: false 
      });
    } else {
      set({ isLoading: false });
    }
  },

  // Group actions
  createGroup: (name, description, members) => {
    const newGroup = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date().toISOString(),
      members: [...members, get().currentUser.id],
      createdBy: get().currentUser.id,
    };

    set(state => {
      const updatedState = {
        ...state,
        groups: [...state.groups, newGroup]
      };
      persistState(updatedState);
      return updatedState;
    });

    return newGroup.id;
  },

  // Expense actions
  addExpense: (groupId, { title, description, amount, category, paidBy, splitAmong, splitType }) => {
    const newExpense = {
      id: uuidv4(),
      groupId,
      title,
      description,
      amount: parseFloat(amount),
      category,
      createdAt: new Date().toISOString(),
      paidBy,
      splitAmong,
      splitType,
      splits: calculateSplits(parseFloat(amount), splitAmong, splitType, paidBy),
    };

    set(state => {
      const updatedState = {
        ...state,
        expenses: [...state.expenses, newExpense]
      };
      persistState(updatedState);
      return updatedState;
    });
  },

  // User-related getters
  getUserById: (userId) => {
    return get().users.find(user => user.id === userId);
  },

  // Group-related getters
  getGroupById: (groupId) => {
    return get().groups.find(group => group.id === groupId);
  },
  
  getGroupsForCurrentUser: () => {
    const currentUserId = get().currentUser.id;
    return get().groups.filter(group => group.members.includes(currentUserId));
  },

  // Expense-related getters
  getExpensesForGroup: (groupId) => {
    return get().expenses.filter(expense => expense.groupId === groupId);
  },

  // Balance calculations
  getBalanceForUserInGroup: (userId, groupId) => {
    const expenses = get().getExpensesForGroup(groupId);
    return calculateBalanceForUser(userId, expenses);
  },

  getTotalBalance: (userId) => {
    const expenses = get().expenses;
    return calculateBalanceForUser(userId, expenses);
  }
}));

// Helper function to calculate splits based on type
function calculateSplits(amount, splitAmong, splitType, paidBy) {
  const splits = {};
  
  if (splitType === 'equal') {
    const perPersonAmount = amount / splitAmong.length;
    splitAmong.forEach(userId => {
      if (userId === paidBy) {
        splits[userId] = 0; // Person who paid doesn't owe themselves
      } else {
        splits[userId] = perPersonAmount;
      }
    });
  } else if (splitType === 'custom') {
    // For custom splits, you would have different logic
    // This would be implemented based on your UI for custom splits
  }
  
  return splits;
}

// Helper function to calculate balance for a user
function calculateBalanceForUser(userId, expenses) {
  let balance = 0;
  
  expenses.forEach(expense => {
    // If this user paid for the expense
    if (expense.paidBy === userId) {
      balance += expense.amount;
    }
    
    // Subtract what this user owes to others
    if (expense.splits && expense.splits[userId]) {
      balance -= expense.splits[userId];
    }
  });
  
  return balance;
}

export default useStore;