import React, {Component} from 'react';
import { View, Text , FlatList ,Button,ScrollView} from 'react-native';
//import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';


class MyProfile extends Component  {

  constructor(props){
    super(props);
    this.state =
    {
      isLoading: true,
      isLoading2: true,
      Type: "",
      User: [],
      FriendList: [],
      
    }
  }

  async componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      //this.userCheck();
      this.getUser();
      this.getFriendList();
      this.checkLoggedIn();
      this.FreindStatus();

    });
    
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

  getFriendList = async () => {
   
    
    const id = this.props.route.params.id;
    console.log(id)
    const value = await AsyncStorage.getItem('@session_token');
    const my_id = await AsyncStorage.getItem('@id');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends", {
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
    this.setState({
      FriendList: responseJson,
    })
   

    for(let i = 0; i < responseJson.length; i++)
    {
      console.log(responseJson[i].user_id)
      if (responseJson[i].user_id == my_id)
      {
        //they are freinds
        this.setState({
          Type: true,
        })
        
      }
      else
      {
        //not freinds 
        this.setState({
          Type: false,
        })
      }
    }
    
  })
  .catch((error) => {
      console.log(error,"Freind List");
      
  })
  }
  getUser= async () => {

    const id = this.props.route.params.id;
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id, {
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
    this.setState({
      User: responseJson,
      isLoading2: false
    })
    this.displayProfile()

  
  })
  .catch((error) => {
      console.log(error,"user data");
      
  })
  }

  
  FreindStatus= async() =>
  {
    
    const id = this.props.route.params.id;
    const value = await AsyncStorage.getItem('@session_token');

    

    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
    

    for(let i = 0; i < responseJson.length; i++)
    {
      if (responseJson[i].user_id == id)
      {
        //make a accept or decline button
        this.setState({
          Type: "accept",
      isloading: false})
         
        //this.AddFreind("accept");
      }
    }

    


    
    
  })
  .catch((error) => {
      console.log(error);
      
  })
  
  }
  AcceptReq = async(id) =>{
    
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id, {
      method: 'POST',
      'headers': {
        'X-Authorization':  value
      }
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
      this.props.navigation.navigate("Home");
      })
      
    
    .catch((error) => {
        console.log(error,"Accept Failed");
        
    })
  }

  DeclineReq = async(id) =>{
    
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id, {
      method: 'DELETE',
      'headers': {
        'X-Authorization':  value
      }
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
      this.props.navigation.navigate("Home");
      })
      
    
    .catch((error) => {
        console.log(error);
        
    })
  
  }
  AddFreind= (data) =>
  {
    const id = this.props.route.params.id;
    console.log(data,"type");

    if(data == "remove")
    {
      //remove freind function within API isnt present
      
    }
    else if(data == "accept")
    {
      //console.log(data);
      return (
        <View>
        <Button 
          title = "Accept"
          onPress={ () => this.AcceptReq(id) }

          
        />
        <Button 
          title = "Decline"
          onPress={ () => this.DeclineReq(id) }
          
          
        />
        </View>
        );
    }
    else
    {
      //console.log(data);
      //add freind button
      return (
        <View>
        <Button 
          title = "Add"
          onPress={ () => this.AddUser(id) }
          
        />
        </View>
        );
    }
  }
  AddUser = async(id) =>{
    
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends", {
      method: 'POST',
      'headers': {
        'X-Authorization':  value
      }
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
      //console.log(responseJson);
      this.props.navigation.navigate("Home");
      })
      
    
    .catch((error) => {
        console.log(error);
        
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
    }else{
      
  return(
  
      <View>
        <Button style={{ color:"red",padding:5, borderWidth:1, margin:5}} 
                    title = "Go Back"
                    onPress={ () => this.props.navigation.goBack() }/>
        

        <Text>{this.state.User.first_name} {this.state.User.last_name} </Text>

        
        <Text>{this.AddFreind(this.state.Type)}</Text>
     
        

        <Text>Freinds:</Text>
        <FlatList
                data={this.state.FriendList}
                getChildrenName={(data) => 'item'}
                renderItem={({item}) => 
                (
                    <ScrollView>
                      <Button 
                      title={item.user_givenname+" "+item.user_familyname}
                      onPress={ () => this.props.navigation.navigate('Profile',{ id: String(item.user_id)}) }/>
                      

                    </ScrollView>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
        />
    

      </View>
            );
                }
            /*

            if(this.state.hasPermission){
              return(
                <View style={styles.container}>
                  <Camera style={styles.camera} type={this.state.type}>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                          let type = type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back;
        
                          this.setState({type: type});
                        }}>
                        <Text style={styles.text}> Flip </Text>
                      </TouchableOpacity>
                    </View>
                  </Camera>
                </View>
              );
            }else{
              return(
                <Text>No access to camera</Text>
              );
            }
            */
            
        
      

      
    }   
    
  


}
export default MyProfile;