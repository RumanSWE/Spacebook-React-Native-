import React, { Component } from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Style from "./Style";
import logo from "./logo.png";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorTxt: "",
    };
  }
  login = async () => {
    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          this.setState({ errorTxt: "Invalid Email or Password" });
          //used display the resposnes from the server
        } else if (response.status == 500) {
          this.setState({ errorTxt: "Server Not Eesponding" });
          //each error code returns a diffrent response to the user
        } else {
          this.setState({ errorTxt: "Something went wrong" });
          throw "Something went wrong";
        }
      })

      .then(async (responseJson) => {
        await AsyncStorage.multiSet([
          ["@session_token", responseJson.token],
          ["@id", String(responseJson.id)],
        ]);
        //multi-set this way two keys can be set at once
        this.props.navigation.navigate("Homes", { screen: "Profile" });
        //navigate to the nested stack which contains the app
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 100,
        }}
      >
        <Image style={{ height: 200, width: 200 }} source={logo} />

        <View style={Style.welcome}>
          <TextInput
            style={Style.inputBox}
            onChangeText={(value) => this.setState({ email: value })}
            value={this.state.email}
          />

          <TextInput
            style={Style.inputBox}
            secureTextEntry={true}
            onChangeText={(value) => this.setState({ password: value })}
            value={this.state.password}
          />

          <Text style={Style.errorText}>{this.state.errorTxt}</Text>

          <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={() => {
              this.login();
            }}
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
