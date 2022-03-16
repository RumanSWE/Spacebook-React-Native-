import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

class UploadDraft {
  async dateCheck() {
    console.log("UPLOAD CHECKER WORKING!!!!!!");

    const get = await AsyncStorage.getItem("draftStore");
    const parsed = JSON.parse(get);

    const today = new Date();

    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].date != null && new Date(parsed[i].date) <= today) {
        
        const token = await AsyncStorage.getItem("@session_token");
        const id = parsed[i].id;

        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
          body: JSON.stringify({
            text: parsed[i].text,
          }),
        })
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else if (response.status === 401) {
              return response.json();
            } else if (response.status === 201) {
              // Remove from item from full list then re-add into the storage
              parsed.splice(i, 1);
              AsyncStorage.setItem("draftStore", JSON.stringify(parsed));
            } else {
              throw "Something went wrong";
            }
          })

          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
}

const UploadDrafts = new UploadDraft();

export default UploadDrafts;
