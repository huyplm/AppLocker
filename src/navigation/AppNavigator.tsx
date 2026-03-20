import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { AppSelectionScreen } from '../screens/AppSelectionScreen';
import { FocusActiveScreen } from '../screens/FocusActiveScreen';
import { LockedPromptScreen } from '../screens/LockedPromptScreen';
import { RootStackParamList } from '../types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: 'transparent',
    primary: colors.accent,
    notification: colors.accent,
  },
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="AppSelection"
          component={AppSelectionScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="FocusActive"
          component={FocusActiveScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="LockedPrompt"
          component={LockedPromptScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
