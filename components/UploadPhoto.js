import React, { Component } from "react";
import { View,Text,FlatList,ScrollView,TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import Style from "./Style";
import UploadDrafts from "./UploadDraft";

class UploadPhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hasPermission: null,
      type: Camera.Constants.Type.back,
      TextError: "",
    };
  }
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      UploadDrafts.dateCheck();
    });
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    console.log(value);

    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };
  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        based64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri);
    }
  };
  sendToServer = async (data) => {
    let value = await AsyncStorage.getItem("@session_token");
    let id = await AsyncStorage.getItem("@id");

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: "POST",
      headers: { "Content-Type": "image/png", "X-Authorization": value },
      body: blob,
    })
      .then((response) => {
        this.setState({ TextError: "Picture Uploaded" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.hasPermission) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={Style.searchBtn}
          >
            <Text style={Style.searchText}>Back</Text>
          </TouchableOpacity>

          <Camera type={this.state.type} ref={(ref) => (this.camera = ref)}>
            <TouchableOpacity
              onPress={() => {
                let type =
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back;

                this.setState({ type: type });
              }}
            >
              <Text style={{backgroundColor: 'white',alignSelf: 'flex-start',borderRadius:15,padding:3}}>Flip </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.takePicture();
              }}
              style={{
                height: 200,
                width: 100,
              }}
            >
              <Text style={{backgroundColor: 'white',alignSelf: 'flex-start',borderRadius:15,padding:3}}>Upload Picture</Text>
            </TouchableOpacity>
          </Camera>
          <Text>{this.state.TextError}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text
            style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}
          >
            No Permissons
          </Text>
        </View>
      );
    }
  }
}
export default UploadPhoto;
