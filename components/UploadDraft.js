import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UploadDraft  {



    async dateCheck() {

      console.log("UPLOAD CHECKER WORKING!!!!!!")

      let get = await AsyncStorage.getItem('draftStore');
      let parsed = JSON.parse(get);

      let today = new Date();

      for(let i = 0; i < parsed.length; i++)
      {
          
          if(parsed[i].date != null && new Date(parsed[i].date) <= today)
          {
            let value = await AsyncStorage.getItem('@session_token');
            let id = parsed[i].id;
            
            return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post", {
              method: 'POST',
              headers: {'Content-Type': 'application/json','X-Authorization':  value},
              body: JSON.stringify({
                text: parsed[i].text
              })
            })
        
            .then((response) => {
              if(response.status === 200){
                  return response.json()
              }else if(response.status === 401){
                return response.json()
              }
              else if(response.status === 201){
                //sucess and delete from async
                parsed.splice(i, 1);
                AsyncStorage.setItem('draftStore', JSON.stringify(parsed))
          
                console.log(AsyncStorage.getItem('draftStore'),"heleoeo")
              }else{
                
                  throw 'Something went wrong';
              }
            })
            
            .catch((error) => {
                console.log(error);
                
            })
            
          
          }
  
      }
      
     
    }



    
  }

  const UploadDrafts = new UploadDraft();
  //export default b;

  



export default UploadDrafts
