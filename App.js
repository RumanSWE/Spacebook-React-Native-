import React, { Component } from 'react';
import * as ALL from 'react';
import { Text, View ,TextInput,Button,FlatList, Alert,Image} from 'react-native';

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
import ProfileFriends from './components/ProfileFriends'

import Search from './components/Search'

const Tab = createBottomTabNavigator();

class App extends Component {

 

  Homes = () => 
  {
    return(
    <Tab.Navigator 
    initialRouteName="Profile"
    
    
    screenOptions={({ route }) => ({
      tabBarButton: [
        "Post",
        "ViewPost",
        "UploadPhoto",
        "ViewDrafts",
        "ProfileFriends"
      ].includes(route.name)
        ? () => {
            return null;
          }
        : undefined,

    })}>  
      <Tab.Screen name="Profile" component={Profile}  
      options={{headerShown: false, tabBarIcon: ({size,focused,color}) => {
        return (
          <Image 
      style={{height:25,width:25}}
      source={require('./assets/profile.png')}
      />)
        }}}
    
      listeners={({ navigation, route }) => ({
    tabPress: e => {
      // Prevent default action
      e.preventDefault();

      navigation.navigate('Profile')
    },})}/>
      <Tab.Screen name="Settings" component={Settings} options={{headerShown: false ,
       tabBarIcon: ({size,focused,color}) => {
        return (
          <Image 
      style={{height:25,width:25}}
      source={require('./assets/settings.png')}
      />)
        }}} />
      <Tab.Screen name="Freinds" component={MyFreinds} options={{headerShown: false ,
       tabBarIcon: ({size,focused,color}) => {
        return (
          <Image 
      style={{height:25,width:25}}
      source={require('./assets/freinds.png')}
      />)
        }}}/>
      <Tab.Screen name="Search" component={Search}  options={{headerShown: false ,
       tabBarIcon: ({size,focused,color}) => {
        return (
          <Image 
      style={{height:25,width:25}}
      source={require('./assets/search.png')}
      />)
        }}}/>

      <Tab.Screen name="UploadPhoto" component={UploadPhoto} options={{headerShown: false }}/>
      <Tab.Screen name="Post" component={Post} options={{headerShown: false}} />
      <Tab.Screen name="ViewPost" component={ViewPost}  options={{headerShown: false}}/>
      <Tab.Screen name="ViewDrafts" component={ViewDrafts} options={{headerShown: false }}/>
      <Tab.Screen name="ProfileFriends" component={ProfileFriends} options={{headerShown: false}}/>

      
      
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


