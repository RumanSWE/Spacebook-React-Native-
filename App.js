import React, { Component } from 'react';
import * as ALL from 'react';
import { Text, View ,TextInput,Button,FlatList, Alert} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { navigationRef } from './RootNavigation';

//import Home from './components/Home'
//import MyProfile from './components/MyProfile'
import Settings from './components/Settings'
import Profile from './components/Profile'
import Post from './components/Post'
import ViewPost from './components/ViewPost'

import StyleSheet from './components/Style';


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

  
  /*
  constructor(props){
    super(props);
    

  this.state= {
      add:"",
      my_list:[]
    }
  }

  onPress = () => 
  {
    console.log(this.state.add)

    if (this.state.add === "") 
    {
        Alert.alert(
          "Error!",
          "No entry, please type something",
          [
            { text: "Cancel" },
            { text: "OK"}
          ]
        );
    }
    else
    {
      let newItem = this.state.my_list.concat(this.state.add)

      this.setState({
        add:"",
        my_list: newItem
      });
    }
    
  }

  remove = (index) => {
    console.log(index);
    let newList = this.state.my_list;
    newList.splice(index, 1);
    this.setState({my_list: newList});
  }

  */
//tabBar={props => <BottomTabBar {...props} state={{...props.state, routes: props.state.routes.slice(0,5)}}></BottomTabBar>}
//{props => <UserProfile {...props} extraData={someData} />} </Tab.Screen>

  Homes = () => 
  {
    return(
    <Tab.Navigator screenOptions={{headerShown: false}} 
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
         //{props => <Profile {...props} extraData={"is"} />}</Tab.Screen
         //<Tab.Screen name='Profile' component={Profile} options={{ title: 'Home' }} />
    })}>  
      <Tab.Screen name="Profile" component={Profile} listeners={({ navigation, route }) => ({
    tabPress: e => {
      // Prevent default action
      e.preventDefault();

      navigation.navigate('Profile')
    },})}/>
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Freinds" component={MyFreinds} />
      <Tab.Screen name="Search" component={Search} />

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
    <Tab.Navigator  screenOptions={{headerShown: false}}>
      <Tab.Screen name="Homes" component={this.Homes} options={{tabBarStyle: { display: "none" } }} />
      <Tab.Screen name="Login" component={Login} options={{tabBarStyle: { display: "none" } }}/>
      <Tab.Screen name="SignUP" component={SignUP}  options={{tabBarStyle: { display: "none" } }}/>
    </Tab.Navigator>
    </NavigationContainer>
 );

    
    /*
      <View>

        <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 10,
              textAlign: 'center'
            }}
            
            onChangeText={value => this.setState({add: value})}
            value={this.state.add}
        />
        <Button
            title="Add"
            onPress={this.onPress}
        />
        

        <FlatList
          data={this.state.my_list}
          renderItem={({item, index}) => 
            <View>
              <Text style={{
              textAlign: 'center',
              paddingTop: 10,
              paddingBottom: 10

            }}
              >{item}</Text>
              <Button
                onPress={() => this.remove(index)}
                title="Done"
              />
            </View>
          }
        />
        
            
      </View>
      */
    
    
      
}

}
export default App


