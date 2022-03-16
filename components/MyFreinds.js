import React, { Component } from "react";
import { ScrollView, View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import Style from "./Style";
import UploadDrafts from "./UploadDraft";

class MyFreinds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ReqList: [],
      FriendList: [],
      errorTxt: "",
    };
  }
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      UploadDrafts.dateCheck(); 
      // checks the draft date by the current date
      this.getReqList(); 
      //initailises all of the propteries for the page
      this.getFriendList();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("@session_token");

    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };
  AcceptReq = async (id) => {
    const value = await AsyncStorage.getItem("@session_token");

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id, {
      method: "POST",
      headers: {
        "X-Authorization": value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          return response.json();
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.getReqList();
        this.getFriendList();
        //"reloads" the page by updating the state of items this way inforamtion is updated without changing pages
      })
      .catch((error) => {
        console.log(error);
      });
  };
  DeclineReq = async (id) => {
    const value = await AsyncStorage.getItem("@session_token");

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id, {
      method: "DELETE",
      headers: {
        "X-Authorization": value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          return response.json();
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.getReqList();
        this.getFriendList();
        //state refresh 
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getFriendList = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("@id");

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
      headers: {
        "X-Authorization": value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          FriendList: responseJson,
          isLoading: false,
        });
        // Due to being the last function loaded the "isLoading" is set to false (page loads then)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getReqList = async () => {
    const value = await AsyncStorage.getItem("@session_token");

    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      headers: {
        "X-Authorization": value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          ReqList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={Style.titleText}>Requests:</Text>
          <FlatList
            data={this.state.ReqList}
            renderItem={({ item }) => (
              <ScrollView>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Profile", {
                      id: String(item.user_id),
                    })
                  }
                  style={Style.buttonStyleDefault}
                >
                  <Text style={Style.buttonText}>
                    {item.first_name + " " + item.last_name}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.AcceptReq(item.user_id);
                  }}
                  style={Style.AcceptButton}
                >
                  <Text style={Style.AcceptText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.DeclineReq(item.user_id);
                  }}
                  style={Style.DeclineButton}
                >
                  <Text style={Style.DeclineText}>Decline</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          />

          <Text style={Style.titleText}>Friends List:</Text>

          <FlatList
            data={this.state.FriendList}
            getChildrenName={(data) => "item"}
            renderItem={({ item }) => (
              <ScrollView>
                <Text></Text>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Profile", {
                      id: String(item.user_id),
                    })
                  }
                  style={Style.buttonStyleDefault}
                >
                  <Text style={Style.buttonText}>
                    {item.user_givenname + " " + item.user_familyname}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
            keyExtractor={(item, index) => item.user_id.toString()}
          />
        </View>
      );
    }
  }
}

export default MyFreinds;
