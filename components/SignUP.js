import React, { Component } from 'react';
import { View, Text , Button, ScrollView, TextInput ,Alert,Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Style from './Style'
import logo from './logo.png'

class SignUP extends Component{
  constructor(props){
    super(props);

    this.state = {
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    }
  } 
  signup = () => {
    //Validation here...

    return fetch("http://localhost:3333/api/1.0.0/user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then((response) => {
        if(response.status === 201){
            return response.json()
        }else if(response.status === 400)
        {
            Alert.alert(
                "Failed Validation",
                "Invalid email/password supplied");   
        }
        else if(response.status == 500)
        {
            Alert.alert(
                "Server Error",
                "Server not responding");   
        }
        else
        {
            throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
           console.log("User created with ID: ", responseJson);
           this.props.navigation.navigate("Login");
    })
    .catch((error) => {
        alert(error)
        console.log(error);
        console.log(JSON.stringify(this.state))
        
    })
}

render(){
  return (
    <View style={{   
        justifyContent: 'center',
      alignItems: 'center',
      marginTop:100
      }} >

        
      <Image 
      style={{height:200,width:200}}
      source={logo}
      /> 
    <View style={Style.welcome}>
                <TextInput
                    placeholder="Enter your first name..."
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}
                    style={Style.inputBox}
                />
                <TextInput
                    placeholder="Enter your last name..."
                    onChangeText={(last_name) => this.setState({last_name})}
                    value={this.state.last_name}
                    style={Style.inputBox}
                />
                <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={Style.inputBox}
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry
                    style={Style.inputBox}
                />
                <TouchableOpacity
                onPress={() => this.signup()}
                style={Style.buttonStyleDefault}

                >
                    <Text style={Style.buttonText}>Create Account</Text>

                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Login")}
                style={Style.buttonStyleDefault}

                >
                    <Text style={Style.buttonText}>Login</Text>

                </TouchableOpacity>
                </View>
            </View>

  );}

}

export default SignUP;