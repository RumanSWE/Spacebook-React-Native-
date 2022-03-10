import React, { Component } from 'react';
import * as ALL from 'react';
import { Text, View ,TextInput,Button,FlatList, Alert} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Settings from './components/Settings'
import Profile from './components/Profile'
import Post from './components/Post'
import ViewPost from './components/ViewPost'

import Style from './components/Style';


import Login from './components/Login'
import SignUP from './components/SignUP'
import MyFreinds from './components/MyFreinds'
import UploadPhoto from './components/UploadPhoto'
import ViewDrafts from './components/ViewDrafts'
import UploadDraft from './components/UploadDraft'
import ProfileFriends from './components/ProfileFriends'

import Search from './components/Search'

const Tab = createBottomTabNavigator();

class App extends Component {


  Homes = () => 
  {
    return(
    <Tab.Navigator 
    initialRouteName="Login"
    
    
    screenOptions={({ route }) => ({
      tabBarButton: [
        "Post",
        "ViewPost",
        "UploadPhoto",
        "ViewDrafts",
        "UploadDraft",
        "ProfileFriends"
      ].includes(route.name)
        ? () => {
            return null;
          }
        : undefined,

    })}>  
      <Tab.Screen name="Profile" component={Profile}  options={{headerShown: false}} listeners={({ navigation, route }) => ({
    tabPress: e => {
      // Prevent default action
      e.preventDefault();

      navigation.navigate('Profile')
    },})}/>
      <Tab.Screen name="Settings" component={Settings} options={{headerShown: false}} />
      <Tab.Screen name="Freinds" component={MyFreinds} options={{headerShown: false}}/>
      <Tab.Screen name="Search" component={Search}  options={{headerShown: false}}/>

      <Tab.Screen name="UploadPhoto" component={UploadPhoto} />
      <Tab.Screen name="Post" component={Post} />
      <Tab.Screen name="ViewPost" component={ViewPost} />
      <Tab.Screen name="ViewDrafts" component={ViewDrafts} />
      <Tab.Screen name="UploadDraft" component={UploadDraft} />
      <Tab.Screen name="ProfileFriends" component={ProfileFriends} />

      
      
    </Tab.Navigator>
    );
  }

render(){
    
  

 return (
    <NavigationContainer>
    <Tab.Navigator 
    initialRouteName="Login"
    options={{headerShown: false}}>
      <Tab.Screen name="Homes" component={this.Homes} options={{tabBarStyle: { display: "none" },headerShown: false}} />
      <Tab.Screen name="Login" component={Login} options={{tabBarStyle: { display: "none" },headerShown: false }}/>
      <Tab.Screen name="SignUP" component={SignUP}  options={{tabBarStyle: { display: "none" },headerShown: false }}/>
    </Tab.Navigator>
    </NavigationContainer>
 );    
      
}

}
export default App


