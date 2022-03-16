import React, { Component } from "react";
import { View, Text, ScrollView, TextInput, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Style from "./Style";
import logo from "./logo.png";

class SignUP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      errorTxt: "",
    };
  }
  signup = () => {
    const regEmail = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    const regName = new RegExp("^(?=.{1,40}$)[a-zA-Z]+(?:[-'s][a-zA-Z]+)*$");

    let emailReg = regEmail.test(this.state.email);

    let passLen = this.state.password.length > 5;

    let first = regName.test(this.state.first_name);
    let last = regName.test(this.state.last_name);

    if (emailReg == false) {
      return this.setState({ errorTxt: "Invalid Email" });
    } else if (passLen == false) {
      return this.setState({errorTxt: "Invalid Password"});
    } else if (first == false) {
      return this.setState({ errorTxt: "Invalid First Name" });
    } else if (last == false) {
      return this.setState({ errorTxt: "Invalid Last Name" });
    }

    return fetch("http://localhost:3333/api/1.0.0/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 400) {
          return this.setState({ errorTxt: "Invalid Data or Email Already In Use" });
        } else if (response.status == 500) {
          this.setState({ errorTxt: "Server Not Responding" });
        } else {
          this.setState({ errorTxt: "Something went wrong" });
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
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
            placeholder="Enter your first name..."
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
            style={Style.inputBox}
          />
          <TextInput
            placeholder="Enter your last name..."
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
            style={Style.inputBox}
          />
          <TextInput
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            style={Style.inputBox}
          />
          <TextInput
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({ password })}
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
    );
  }
}

export default SignUP;
