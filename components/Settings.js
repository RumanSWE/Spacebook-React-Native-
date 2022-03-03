import React, {Component} from 'react';
import { View, Text , FlatList ,Button,ScrollView,TextInput,Alert,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class Settings extends Component  {
  constructor(props){
    super(props);

    this.state = {
      first_name: "",
      last_name:"" ,
      email:"" ,
      password:"",
      id: "",
      isLoading: true,
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
}
async componentDidMount() 
{
 

  this.unsubscribe = this.props.navigation.addListener('focus', () => 
  {
    this.checkLoggedIn();
    this.GetUser();
  });
  const { status } = await Camera.requestCameraPermissionsAsync();
  this.setState({hasPermission: status === 'granted'});
  

 
}

componentWillUnmount() 
{
  this.unsubscribe();
}

checkLoggedIn = async () => 
{
  const value = await AsyncStorage.getItem('@session_token');
  console.log(value)
  

  if (value == null) 
  {
      this.props.navigation.navigate('Login');
  }
};


  logout = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/logout", {
        method: 'POST',
        headers: {
            "X-Authorization": token
        }
    })
    .then((response) => {
        if(response.status === 200){
            this.props.navigation.navigate("Login");
        }else if(response.status === 401){
          Alert.alert(
            "Failed To Logout",
            "This action isnt authorised");   
        }else{
            throw 'Something went wrong';
        }
    })
    .catch((error) => {
        console.log(error);
        //ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }
 
  GetUser = async() =>{

    const value = await AsyncStorage.getItem('@session_token');
    
    const id = await AsyncStorage.getItem('@id');
    

    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id, {
    
      'headers': {'X-Authorization':  value},
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        return response.json()
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {

      this.setState({
        first_name: responseJson.first_name,
        last_name: responseJson.last_name,
        email: responseJson.email,
        isLoading: false,
      })
      
      })
      
    
    .catch((error) => {
        console.log(error);
        
    })
  }
  
  
  
  updateItem = async() =>{
    
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');

    if (this.state.password == "")
    {
      return fetch("http://localhost:3333/api/1.0.0/user/"+id, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json','X-Authorization':  value},
        body: JSON.stringify({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
           
        })
      })
      .then((response) => {
        if(response.status === 200){
          Alert.alert(
            "Success",
            "Information Updated");   
        }else if(response.status === 401){
          Alert.alert(
            "Error",
            "Please enter information with the correct values");
        }else{
            throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        })
        
      
      .catch((error) => {
          console.log(error);
          
      })

    }
    else if(this.state.password != "")
    return fetch("http://localhost:3333/api/1.0.0/user/"+id, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json','X-Authorization':  value},
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
         
      })
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        return response.json()
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log(responseJson);
      })
      
    
    .catch((error) => {
        console.log(error);
        
    })
    

  }
  takePicture = async() =>{
    console.log("PRessed")
    console.log(this.camera)

    if(this.camera)
    {
      const options = {
        quality:0.5, 
        based64:true,
        onPictureSaved: (data => this.sendToServer(data))
      };
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri);
    }
  }
  sendToServer = async (data) => {

    let value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem('@id');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/photo", {
      method: 'POST',
      headers: {'Content-Type': 'image/png','X-Authorization':  value},
      body: blob
    })

  .then((response) => {
    Alert.alert("Picture Added")
    console.log("picture added", response)
  })
  .catch((err) => {
    console.log(err);
  })

  }
  render(){
    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else if(this.state.hasPermission){
      return(
    
      <ScrollView>
        
        <Button
          title="logout"
          onPress={() => this.logout()}
        />
        
        <TextInput
            placeholder="Enter your first name..."
            onChangeText={(first_name) => this.setState({first_name})}
            value={this.state.first_name}
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <TextInput
            placeholder="Enter your last name..."
            onChangeText={(last_name) => this.setState({last_name})}
            value={this.state.last_name}
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <TextInput
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <TextInput
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <Button
            title="Update Information"
            onPress={() => this.updateItem()}
        />
    
          <Camera  
          type={this.state.type}
          ref={ref => this.camera = ref}>
            
              <TouchableOpacity
                
                onPress={() => {
                  let type = type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back;

                  this.setState({type: type});
                }}>
                <Text>Flip </Text>
              </TouchableOpacity>

              

            
          
          <TouchableOpacity
                //title="Take Picture"
                onPress={() => {
                  this.takePicture();
                }}>
                  <Text>Take Picture</Text>
            </TouchableOpacity>
            
            </Camera>
          </ScrollView>
      );
    }else{
      return(
        <Text>No access to camera</Text>
      );
    }
  }

    

}

export default Settings;