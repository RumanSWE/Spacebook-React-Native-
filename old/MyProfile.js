import React, {Component} from 'react';
import { View, Text , FlatList ,Button,ScrollView,TextInput,RefreshControl} from 'react-native';
//import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class MyProfile extends Component  {

  constructor(props){
    super(props);
    this.state =
    {
      isLoading: true,
      User: [],
      FriendList: [],
      Posts: [],
      edit: "",
  
      
    }
  }

  async componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
      this.GetPost();
      this.getUser();
      this.getFriendList();
      
    });
    
    //const { status } = await Camera.requestCameraPermissionsAsync();
    //this.setState({hasPermission: status === 'granted'});
    
  }
  
  componentWillUnmount() 
  {
    this.unsubscribe();
  }

  checkLoggedIn = async () => 
  {
    const value = await AsyncStorage.getItem('@session_token');

    if (value == null) 
    {
        this.props.navigation.navigate('Login');
    }
  };
  getFriendList = async () => {

    console.log("hello")
    
    const id = await AsyncStorage.getItem('@id');
    
    const value = await AsyncStorage.getItem('@session_token');
    
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
      isLoading: false
    })
    
  })
  .catch((error) => {
      console.log(error);
      
  })
  }
  getUser= async () => {
    const id = await AsyncStorage.getItem('@id');
    
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
      User: responseJson
    })
    
    
  })
  .catch((error) => {
      console.log(error);
      
  })
  }
  GetPost = async()=>
  {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');

    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post", {
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

      this.setState({Posts: responseJson})
      console.log(this.state.Posts)

   
    })
    .catch((error) => {
        console.log(error);
    
    })
  }
  DeletePost = async(Post_id)=>
  {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+Post_id, {
      method: 'DELETE',
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          //setRefreshing(true);
          //wait(2000).then(() => setRefreshing(false));
          for (let i = 0; i < this.state.Posts.length; i++) {
            if(this.state.Posts[i].post_id == Post_id)
            {
              //this.setState({Posts: }) = 
              //console.log(this.state.Posts) 
              let delPosts = this.state.Posts.slice(0, i).concat(this.state.Posts.slice(i + 1,  this.state.Posts.length))
              this.setState({Posts: delPosts})
            }
            
          }
         
          
          
      }else if(response.status === 401){
        return response.json()
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
     
      //
      console.log(responseJson);
      })
      
    
    .catch((error) => {
        console.log(error);
        
    })
    
  }
  render(){
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
        <Text>{this.state.User.first_name} {this.state.User.last_name} </Text>
        <Button 
        title="Upload Photo"
        />

        <Text>Freinds:</Text>
        <FlatList
                data={this.state.FriendList}
                //getChildrenName={(data) => 'item'}
                renderItem={({item}) => 
                (
                    <ScrollView>
                      <Button title={item.user_givenname+" "+item.user_familyname} 
                      onPress={ () => this.props.navigation.navigate('Profile',{ id: String(item.user_id)}) }/>
                      

                    </ScrollView>
                )}
                //keyExtractor={(item,index) => item.user_id.toString()}

        />
        <Text>    All Posts: </Text>
      

                <FlatList
                data={this.state.Posts} 
                getChildrenName={(data) => 'item'}
                renderItem={({item}) => 
                (
                    <ScrollView>
                      
                      
                        <Button
                      title={item.author.first_name+" "+item.author.last_name+"\n "+item.text+"\n Likes: "+(item.numLikes+"    "+new Date(item.timestamp).toLocaleDateString('en-GB'))}
                      onPress={ () => this.props.navigation.navigate('ViewPost',{ items: item}) }
                      />

                      <Button title="Edit" onPress={ () => this.props.navigation.navigate('Post',{ item: item}) }/>
                
                      <Button title="Delete" onPress={() => {this.DeletePost(item.post_id)}}/>
                      
                      <Text></Text>
                      

                    </ScrollView>
                    
                )}
                //keyExtractor={(item,index) => item.user_id.toString()}
               
        />
    

      </View>
            );
                }
            
        
      

      
    }   
    
  


}
export default MyProfile;