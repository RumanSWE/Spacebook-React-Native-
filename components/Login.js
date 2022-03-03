import React, { Component } from 'react';
import { View, Text , StyleSheet,TextInput,Button , Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      console.log(responseJson);
      await AsyncStorage.multiSet([['@session_token',responseJson.token],['@id',String(responseJson.id)]]);
      
      
      this.props.navigation.navigate("Profile");
    })
    .catch((error) => {
      console.error(error);
    });
  }

  
 

render(){
    return (

      <View>
        
        <TextInput
          style={styles.textInput}
          onChangeText={value => this.setState({email: value})}
          value={this.state.email}
        />
  
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={value => this.setState({password: value})}
          value={this.state.password}
        />
  
        <Button
          style={styles.loginButton}
          title="Login"
          onPress={() => {this.login()}}
        />

        <Button
          style={styles.loginButton}
          title="Sign Up"
          onPress={() => this.props.navigation.navigate("SignUP")}
        />
  
        </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: 'lightgrey',
    borderWidth: 10,
    textAlign: 'center'
  },
  loginButton:{
    height: 40,
    borderWidth: 10,
    textAlign: 'center'
  }
});


export default Login;