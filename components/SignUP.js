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
        password: "",
        errorTxt: "",
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
            this.props.navigation.navigate("Login");
        }else if(response.status === 400)
        {
            console.log("hlleoe")
            this.setState({errorTxt:"Invalid Or Missng Information"})
        }
        else if(response.status == 500)
        {
            this.setState({errorTxt:"Server Not Responding"})  
        }
        else
        {
            this.setState({errorTxt:"Something went wrong"})
            throw 'Something went wrong';
        }
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
                <Text style={Style.errorText}>{this.state.errorTxt}</Text>
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