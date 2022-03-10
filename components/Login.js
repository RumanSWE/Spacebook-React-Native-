import React, { Component } from 'react';
import { View, Text , StyleSheet,TextInput,Button ,TouchableOpacity,Image} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from './Style'
import logo from './logo.png'

class Login extends Component {

  constructor(props){
    super(props);


  this.state= {
    email:"",
    password:""
    }
  }
  login = async() =>{
    return fetch("http://localhost:3333/api/1.0.0/login",
    {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
  
    })

    .then((response) => 
    {
      if(response.status === 200)
        {
          return response.json()
        }
      else if(response.status === 400)
        {
          Alert.alert(
            "Failed Validation",
            "Invalid email/password supplied");   
        }
        else if(response.status == 500)
        {
          Alert.alert(
            "Serer Error",
            "Server stopped responding");   
        }
      else
        {
          throw 'Something went wrong';
        }
    })

    .then(async (responseJson) => 
    {
      await AsyncStorage.multiSet([['@session_token',responseJson.token],['@id',String(responseJson.id)]]);
      this.props.navigation.navigate('Homes', { screen: 'Profile' });
    })
    .catch((error) => {
      console.error(error);
    });
  }

render(){
    return (

     
       
      
      <View style={{   
        justifyContent: 'center',
      alignItems: 'center',
      marginTop:100}} >

        
      <Image 
      style={{height:200,width:200}}
      source={logo}
      /> 
      
        
      <View style={Style.welcome}>
        
      
        

        <TextInput
          style={Style.inputBox}
          onChangeText={value => this.setState({email: value})}
          value={this.state.email}
        />
  
        <TextInput
          style={Style.inputBox}
          secureTextEntry={true}
          onChangeText={value => this.setState({password: value})}
          value={this.state.password}
        />
        <TouchableOpacity
          style={Style.buttonStyleDefault}
          onPress={() => {this.login()}}
        > 
        <Text style={Style.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Style.buttonStyleDefault}
          onPress={() => this.props.navigation.navigate("SignUP")}
        > 
        <Text style={Style.buttonText}>Sign Up</Text>
        </TouchableOpacity>
  
        </View>
        </View>
        
    );
  }
}


export default Login;