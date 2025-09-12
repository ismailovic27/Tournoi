import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import GroupsScreen from '../screens/GroupsScreen';
import MatchesScreen from '../screens/MatchesScreen';
import StandingsScreen from '../screens/StandingsScreen';
import MatchDetailScreen from '../screens/MatchDetailScreen';

// Types
export type RootStackParamList = {
  MainTabs: undefined;
  MatchDetail: { matchId: string };
};

export type MainTabParamList = {
  Groups: undefined;
  Matches: undefined;
  Standings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingTop: 5,
          paddingBottom: 5,
        },
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Groups" 
        component={GroupsScreen} 
        options={{ 
          title: 'المجموعات',
          tabBarLabel: 'المجموعات'
        }} 
      />
      <Tab.Screen 
        name="Matches" 
        component={MatchesScreen} 
        options={{ 
          title: 'المباريات',
          tabBarLabel: 'المباريات'
        }} 
      />
      <Tab.Screen 
        name="Standings" 
        component={StandingsScreen} 
        options={{ 
          title: 'الترتيب',
          tabBarLabel: 'الترتيب'
        }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MatchDetail" 
          component={MatchDetailScreen} 
          options={{ 
            title: 'تفاصيل المباراة',
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}