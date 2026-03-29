import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from "@expo/vector-icons"
import * as SystemUI from 'expo-system-ui';
SystemUI.setBackgroundColorAsync("#000000");



import StudyScreen from "./Screen/StudyScreen"
import ProfileScreen from "./Screen/ProfileScreen"
import HomeScreen from './Screen/HomeStack/HomeScreen'
import SubjectScreen from './Screen/HomeStack/SubjectScreen'
import StudyModeScreen from './Screen/HomeStack/StudyModeScreen'


const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()





function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#0f0f0f' },
      animation: 'fade',
    }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Subject" component={SubjectScreen} />
      <Stack.Screen name="StudyMode" component={StudyModeScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  return(
    <NavigationContainer>
       <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: { backgroundColor: '#0f0f0f', borderTopWidth: 0 },
          tabBarActiveTintColor: '#6C63FF',
          tabBarInactiveTintColor: '#555555',
          headerShown: false,
           sceneStyle: { backgroundColor: '#0f0f0f' },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home'

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline'
            } else if (route.name === 'Study') {
              iconName = focused ? 'book' : 'book-outline'
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline'
            }
            

            return <Ionicons name={iconName } size={size} color={color} />
          },
        })}
        >

        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Study" component={StudyScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  )
}