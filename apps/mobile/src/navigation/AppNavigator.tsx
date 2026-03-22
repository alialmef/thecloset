import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/auth-store';
import { LoadingState } from '../components/States';

// Auth screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { SignUpScreen } from '../screens/SignUpScreen';

// Main tab screens
import { HomeScreen } from '../screens/HomeScreen';
import { ClosetsScreen } from '../screens/ClosetsScreen';
import { StyleScreen } from '../screens/StyleScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// Detail screens
import { ItemDetailScreen } from '../screens/ItemDetailScreen';
import { AddItemScreen } from '../screens/AddItemScreen';
import { GroupDetailScreen } from '../screens/GroupDetailScreen';
import { CreateGroupScreen } from '../screens/CreateGroupScreen';
import { JoinGroupScreen } from '../screens/JoinGroupScreen';
import { FriendClosetScreen } from '../screens/FriendClosetScreen';

import { colors, typography } from '../theme';

// ─── Type Definitions ────────────────────────────────

export type AuthStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
};

export type ClosetsStackParamList = {
  ClosetsHome: undefined;
  ItemDetail: { itemId: string };
  AddItem: undefined;
  FriendCloset: { userId: string; userName: string };
};

export type HomeStackParamList = {
  HomeFeed: undefined;
  ItemDetail: { itemId: string };
};

export type ActivityStackParamList = {
  ActivityHome: undefined;
  ItemDetail: { itemId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  GroupDetail: { groupId: string };
  CreateGroup: undefined;
  JoinGroup: undefined;
  ItemDetail: { itemId: string };
};

export type RootTabParamList = {
  Home: undefined;
  Closets: undefined;
  Style: undefined;
  Activity: undefined;
  Profile: undefined;
};

// ─── Navigators ──────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ClosetsStack = createNativeStackNavigator<ClosetsStackParamList>();
const ActivityStack = createNativeStackNavigator<ActivityStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// ─── Auth Navigator ──────────────────────────────────

function AuthNavigator(): React.JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome">
        {({ navigation }) => <WelcomeScreen onGetStarted={() => navigation.navigate('SignUp')} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="SignUp">
        {({ navigation }) => <SignUpScreen onBack={() => navigation.goBack()} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

// ─── Tab Stack Navigators ────────────────────────────

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen name="HomeFeed" component={HomeScreen} options={{ title: 'Home' }} />
      <HomeStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Item' }}
      />
    </HomeStack.Navigator>
  );
}

function ClosetsStackNavigator(): React.JSX.Element {
  return (
    <ClosetsStack.Navigator screenOptions={stackScreenOptions}>
      <ClosetsStack.Screen
        name="ClosetsHome"
        component={ClosetsScreen}
        options={{ title: 'My Closet' }}
      />
      <ClosetsStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Item' }}
      />
      <ClosetsStack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{ title: 'Add Item' }}
      />
      <ClosetsStack.Screen
        name="FriendCloset"
        component={FriendClosetScreen}
        options={({ route }) => ({ title: `${route.params.userName}'s Closet` })}
      />
    </ClosetsStack.Navigator>
  );
}

function ActivityStackNavigator(): React.JSX.Element {
  return (
    <ActivityStack.Navigator screenOptions={stackScreenOptions}>
      <ActivityStack.Screen
        name="ActivityHome"
        component={ActivityScreen}
        options={{ title: 'Activity' }}
      />
      <ActivityStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Item' }}
      />
    </ActivityStack.Navigator>
  );
}

function ProfileStackNavigator(): React.JSX.Element {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions}>
      <ProfileStack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ title: 'Group' }}
      />
      <ProfileStack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ title: 'Create Group' }}
      />
      <ProfileStack.Screen
        name="JoinGroup"
        component={JoinGroupScreen}
        options={{ title: 'Join Group' }}
      />
      <ProfileStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Item' }}
      />
    </ProfileStack.Navigator>
  );
}

// ─── Main Tab Navigator ──────────────────────────────

function MainNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.gray200,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: typography.size.xs,
          fontWeight: typography.weight.medium,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Closets" component={ClosetsStackNavigator} />
      <Tab.Screen name="Style" component={StyleScreen} />
      <Tab.Screen name="Activity" component={ActivityStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ──────────────────────────────────

export function AppNavigator(): React.JSX.Element {
  const { isAuthenticated, isLoading, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

// ─── Shared Options ──────────────────────────────────

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.white },
  headerTitleStyle: { fontWeight: typography.weight.semibold as '600' },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  headerTintColor: colors.primary,
};
