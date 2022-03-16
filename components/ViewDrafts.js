import React, { Component, useState } from "react";
import { ScrollView, View, Text, FlatList, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import Style from "./Style";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import UploadDrafts from "./UploadDraft";

class ViewDrafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      texts: [],
      fullDraft: [],
      isLoading: true,
      TextError: "",
      time: [],
      initialText: [],
      date: new Date(),
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      UploadDrafts.dateCheck();
      this.getDrafts();
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
  deleteDraft = async (index) => {
    let my_id = await AsyncStorage.getItem("@id");

    let delText = this.state.texts[index];

    let list = this.state.fullDraft;

    console.log(list);

    for (let i = 0; i < list.length; i++) {
      if (list[i].id == my_id && list[i].text == delText) {
        list.splice(i, 1);
        AsyncStorage.setItem("draftStore", JSON.stringify(list));

        console.log(await AsyncStorage.getItem("draftStore"), "heleoeo");

        this.getDrafts();
      }
    }
  };
  getDrafts = async () => {
    let my_id = await AsyncStorage.getItem("@id");
    let get = await AsyncStorage.getItem("draftStore");
    let parsed = JSON.parse(get);

    console.log(parsed);

    this.setState({ fullDraft: parsed });

    let textList = [];
    let other = [];

    if (parsed.length == 0) {
      this.setState({ texts: [] });
      return this.setState({
        TextError: "No Saved Drafts , Please Save Draft",
      });
    }

    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].id == my_id) {
        textList.push(parsed[i].text);
        other.push(parsed[i].text);
      }
    }

    this.setState({ initialText: other });
    this.setState({ texts: textList });

    this.setState({ isLoading: false });
  };
  AddPost = async (index) => {
    const value = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("@id");

    if (this.state.text == "") {
      return this.setState({ TextError: "Please Enter Text" });
    }

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Authorization": value },
      body: JSON.stringify({
        text: this.state.texts[index],
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          return response.json();
        } else if (response.status === 201) {
          this.deleteDraft(index);
          this.getDrafts();
          this.setState({ TextError: "Draft Uploaded To Profile" });
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
      })

      .catch((error) => {
        console.log(error);
      });
  };
  saveDraft = async (index) => {
    let id = await AsyncStorage.getItem("@id");

    let curText = this.state.texts[index];
    let list = this.state.fullDraft;
    let oldText = this.state.initialText[index];

    if (curText == "") {
      return this.setState({ TextError: "No Text , Cant Save Draft" });
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == id && list[i].text == oldText) {
          list[i].text = curText;

          let initialText = this.state.initialText;
          initialText[index] = curText;
          this.setState({ initialText });

          this.setState({ fullDraft: list });
          this.setState({ TextError: "Draft Uploaded" });
          AsyncStorage.setItem("draftStore", JSON.stringify(list));
        }
      }
    }
  };
  setDate = async (index) => {
    const today = new Date();
    let date = new Date(this.state.date);

    const id = await AsyncStorage.getItem("@id");

    const curText = this.state.texts[index];
    if (curText == "") {
      return this.setState({ TextError: "No Text Saved" });
    }
    const list = this.state.fullDraft;
    const time = this.state.time[index];

    const reg = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
    let regBool = reg.test(time);

    if (regBool == false) {
      return this.setState({
        TextError: "Invalid Time Entered (Please Try Again)",
      });
    }

    let hour = String(time.slice(0, 2));
    let min = String(time.slice(3, 5));

    date.setHours(hour, min, 0, 0);

    if (date == "invalid date" || date < today) {
      return this.setState({ TextError: "invalid format or date in the past" });
    }

    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id && list[i].text == curText) {
        list[i].date = date;

        this.setState({ fullDraft: list });
        console.log(this.state.fullDraft);
        this.setState({ TextError: "Draft Scheduled for " + date });
        AsyncStorage.setItem("draftStore", JSON.stringify(list));
        this.getDrafts();
      }
    }
  };
  checkSchedule = (index) => {
    let date = this.state.fullDraft[index].date;

    if (date != null) {
      date = new Date(date);
      return (
        <View>
          <Text>Schedule Upload For {date.toLocaleString("en-GB")}</Text>
        </View>
      );
    }
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
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={Style.searchBtn}
          >
            <Text style={Style.searchText}>Back</Text>
          </TouchableOpacity>

          <Text>Loading</Text>

          <Text>{this.state.TextError}</Text>
        </View>
      );
    } else {
      return (
        <ScrollView>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={Style.searchBtn}
          >
            <Text style={Style.searchText}>Back</Text>
          </TouchableOpacity>

          <Text style={Style.titleText}>Draft's</Text>

          <Text style={Style.errorText}>{this.state.TextError}</Text>

          <FlatList
            data={this.state.texts}
            getChildrenName={(data) => "item"}
            renderItem={({ item, index }) => (
              <ScrollView>
                <TextInput
                  onChangeText={(text) => {
                    let texts = this.state.texts;
                    texts[index] = text;
                    this.setState({ texts });
                  }}
                  value={this.state.texts[index]}
                  style={Style.inputBox}
                />

                <TouchableOpacity
                  onPress={() => {
                    this.saveDraft(index);
                  }}
                  style={Style.buttonStyleDefault}
                >
                  <Text style={Style.buttonText}>Save To Storage</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.AddPost(index);
                  }}
                  style={Style.buttonStyleDefault}
                >
                  <Text style={Style.buttonText}>Upload Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.deleteDraft(index);
                  }}
                  style={Style.buttonStyleDefault}
                >
                  <Text style={Style.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TextInput
                  placeholder="HH:MM (24 Hour Format)"
                  onChangeText={(times) => {
                    let time = this.state.time;
                    time[index] = times;
                    this.setState({ time });
                  }}
                  value={this.state.time[index]}
                  style={Style.inputBox}
                />

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Calendar
                    onChange={(date) => this.setState({ date })}
                    value={this.state.date}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => this.setDate(index)}
                  style={Style.buttonStyleDefault}
                >
                  <Text style={Style.buttonText}>Schedule Upload</Text>
                </TouchableOpacity>
                <Text style={Style.errorText}>{this.checkSchedule(index)}</Text>
                <Text style={{ paddingBottom: 50 }}></Text>
              </ScrollView>
            )}
          />
        </ScrollView>
      );
    }
  }
}
export default ViewDrafts;
