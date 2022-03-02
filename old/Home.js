import React, { Component } from 'react';
import { View, Text, Button, FlatList, TextInput,ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';

//import Search from './components/Search'

class Home extends Component{
  constructor(props){
    super(props);
    this.state =
    { 
      isLoading: true,
      FriendList: [],
      Posts: [],
      text: "",
      like: "like",
    }
  }
  componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
      this.getFriendList(); 
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
  AddPost = async()=>
  {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');

    if(this.state.text == "" )
    {
      return (Alert.alert("Please Type Something To Post"))
    }
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post", {
      method: 'POST',
      headers: {'Content-Type': 'application/json','X-Authorization':  value},
      body: JSON.stringify({
        text: this.state.text,
      })
    })

    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        return response.json()
      }
      else if(response.status === 201){
        this.setState({text: ""})
        console.log("POST UPLOADED!!!");
        Alert.alert("Post Uploaded")

      }else{
        console.log(response.status);
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
  UnlikePost = async(post_id)=>
  {

    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');

    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+post_id+"/like", {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json','X-Authorization':  value},
    
    })

    .then((response) => {
      if(response.status === 200){
          return response.json()
          //change to like button
      }else if(response.status === 401){
        return response.json()
       } else if(response.status == 403){
      //change to like button
      
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.setState({like: "like"})
      })
      
    
    .catch((error) => {
        console.log(error);
        
    })

  }


  LikePost = async(post_id)=>
  {

    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');

      return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+post_id+"/like", {
        method: 'POST',
        headers: {'Content-Type': 'application/json','X-Authorization':  value},
      
      })
  
      .then((response) => {
        if(response.status === 200){
            return response.json()
            //change to unlike button
        }else if(response.status === 401){
          return response.json()
        }
        else if (response.status == 403){
          //change to unlike button
          this.setState({like: "unlike"})
        
        }else{
            throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({like: "unlike"})
        })
        
      
      .catch((error) => {
          console.log(error);
          
      })

       
    

    
    //sends a like to server for a particcular post and user
    //displays a remove like button which then on press can be removed
    
  }

  
  getFriendList = async () => {
    
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');
    
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
    this.setState
    ({
      FriendList: responseJson
    })
    
        for(let i = 0; i < responseJson.length; i++)
    {
      let id = responseJson[i].user_id;
      this.loadPosts(id);
      console.log("sent")
      console.log("")
    }
  
    
    
  })
  .catch((error) => {
      console.log(error);
      
  })
  }

  


  loadPosts = async(id) =>{

    const value = await AsyncStorage.getItem('@session_token');

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
      
      if(responseJson == "" )
      {
        console.log(id,"no posts avaliable")
      }
      else if(responseJson != "")
      {
        this.setState({
          Posts: responseJson,
        isLoading: false
      })
      console.log("before get likes")
      this.GetLikes(responseJson.post_id)
      }

    

   
    })
    .catch((error) => {
        console.log(error);
    
    })
  }
  GetLikes= async (post_id)=>
  {

    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');
    console.log(post_id)

      return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+post_id+"/like", {
        method: 'POST',
        headers: {'Content-Type': 'application/json','X-Authorization':  value},
      
      })
  
      .then((response) => {
        if(response.status === 200){
            //automaticlly unlike and set state of that like button to like
            //this.setState({like: "like"})
            this.UnlikePost(post_id);
            console.log("not liked"+post_id)

        }else if(response.status === 401){
          return response.json()
        }
        else if (response.status == 403){
          this.setState({like: "like"})

        }else{
            console.log(response)
            throw 'Something went wrong here';
        }
      })
      .then((responseJson) => {
        console.log("post already liked",post_id)
        this.setState({like: "unlike"})
        })
        
      
      .catch((error) => {
          console.log(error);
          
      })

  }
  DateGet=(time)=>
  {
    const postDate = new Date(time);
    const curDate = new Date();

    const diff = Math.abs(curDate - postDate)

    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24)); 


    if (diffDays <= 1)
    {
      return(Math.ceil(diff / (1000 * 60 * 60))+" Hours Ago");
    }
    else if (diffDays > 1)
    {
      return(diffDays+" Days Ago")
    }
    else if (diffDays > 30)
    {
     
      return(postDate.toLocaleDateString('en-GB'))
    }
    
    
    

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
    return (
      <View>

        <TextInput
              placeholder="Type New Post Here..."
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              style={{padding:5, borderWidth:1, margin:5}}
        />

        <Button 
        title="Add New Post"
        onPress = {() => {this.AddPost()}}
        />
        <Text> </Text>


          <FlatList
                data={this.state.Posts}
                renderItem={({item}) => 
                (
                    <ScrollView>
                      
                      <Button
                      title={item.author.first_name+" "+item.author.last_name+"\n "+item.text+"\n Likes: "+(item.numLikes+"     "+this.DateGet(item.timestamp))}
                      onPress={ () => this.props.navigation.navigate('ViewPost',{ items: item}) }
                      />
                      
                      <Button
                      title={this.state.like} 
                      onPress={() => {this.LikePost(item.post_id)}}
                      />
                    </ScrollView>
                )}
              />
        
        
      </View>
    );
    }
  }
}

export default Home;