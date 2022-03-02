import React, {Component} from 'react';
import { View, Text , FlatList ,Button,ScrollView,TextInput,Alert} from 'react-native';
//import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TouchHistoryMath from 'react-native/Libraries/Interaction/TouchHistoryMath';


class Profile extends Component  {

  constructor(props){
    super(props);
    this.state =
    {
      Type: "",
      User: [],
      FriendList: [],
      Freinds: false,
      id: "",
      Posts: [],
      text: "",
      
    }
  }

  async componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
      this.userCheck();
      
      

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
  }
  userCheck= async() =>
  {
    
  
    try 
    {
      const id = this.props.route.params.id;
      this.setState({id: id})
      this.getFriendList(id);
      this.getUser(id);
      console.log("someone elses profile")
    } 
    catch (error) 
    {
      console.log("this is my own profile");
      this.setState({Freinds: true})
      
      const my_id = await AsyncStorage.getItem('@id');
      this.setState({id: my_id})
      this.getFriendList(my_id);
      this.getUser(my_id);
      this.loadPosts(my_id);
    }
   

    

  }
  getUser= async (id) => {

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
    this.setState
    ({
      User: responseJson,
    })

  
  })
  .catch((error) => {
      console.log(error,"user data");
      
  })
  }
  getFriendList = async (id) => {
   
    console.log(id,"get freinds")
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
      }else if(response.status == 403)
      {
        {
          console.log("not freinds")
          this.setState({
            Freinds: false,
          })
          this.FreindStatus(id);
        }

      }
      else if(responss.status == 200)
      {
        this.setState({
          FriendList: responseJson,
          Freinds: true,
        })
        this.loadPosts(my_id);

      }
      else
      {
          throw 'Something went wrong';
      }
  })
  .catch((error) => {
    console.log(error,"Freind List");
    
})


   
   
  /*
  if(this.state.Freinds == false)
  {
    for(let i = 0; i < responseJson.length; i++)
    {
      console.log(responseJson[i].user_id)
      if (responseJson[i].user_id == my_id)
      {
        console.log("we are freinds")
        this.setState({
          Freinds: true,
        })
        
      }
      else
      {
        console.log("not freinds")
        this.setState({
          Freinds: false,
        })
        this.FreindStatus(id);
      }
    }
  }
  */
    
  
 
  }
  FreindStatus= async(id) =>
  {
    console.log("status")
    
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

    console.log(responseJson)

    if(responseJson.length == 0)
    {
      console.log("add friend")
      //add freind button now
      this.setState({
        Type: "add",
        })
    }

    for(let i = 0; i < responseJson.length; i++)
    {
      if (responseJson[i].user_id == id)
      {
        console.log("accept/decline requst")
        //make a accept or decline button
        this.setState({
          Type: "accept",
          })
      }
      else
      {
        console.log("add friend")
        //add freind button now
        this.setState({
          Type: "add",
          })
      }
    }
  })
  .catch((error) => {
      console.log(error);
      
  })
}
addFreind = async(id) =>{
    
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
FreindButtonStatus= (data) =>
{
  const id = this.state.id;

  data = String(data);

  if(data == "add")
  {
    return(
      <View>
        <Button 
        title = "Add Freind"
        onPress={ () => this.addFreind(id) } 
        />
      </View>
  );
    
  }
  else if(data == "accept")
  {
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
  loadPosts = async(id) =>{

    console.log(id,"should be 9")

    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post", {
      method: 'GET',
      'headers': {
       'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
         return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }
      else if(response.status == 304)
      {
        return response.json()
      }
      else{
          throw 'Something went wrong';
      } 
    })
    .then((responseJson) => {
      
      console.log(responseJson)
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
  checkPoster= async(my_id,post_id) =>
  {
    const id = this.state.id;

    if (id == my_id)
    {
      return(
      <View>
        <Button 
        title="Edit"
        onPress={ () => this.props.navigation.navigate('Post',{ item: item}) }
        />

         <Button 
        title="Delete"
        onPress={this.DeletePost(post_id)}
        />
        </View>
        );
    }
  }
  DeletePost = async(Post_id)=>
  {
    console.log("DELETING")
    const value = await AsyncStorage.getItem('@session_token');
    const id = this.state.id;
    
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
  AddPost = async()=>
  {
    const value = await AsyncStorage.getItem('@session_token');
    const id = this.state.id;

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

  //not freinds (show add freind,name and profile pic)

  //user details (1)
  //check if user is freinds with logged in user
  //gets all posts for that user
  //enable editing and deleting for own posts from logged in user


  //the users freinds (1)
  //user profile
  //current logged in user 

  render(){

    if (this.state.Freinds == false){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>

          <Text>{this.state.User.first_name} {this.state.User.last_name} </Text>
          <Text>{this.FreindButtonStatus(this.state.Type)}</Text>
          
        </View>
      );
    }else{
      
    return(
      <View>

      <Text>{this.state.User.first_name} {this.state.User.last_name} </Text>

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

      
      <Text>remove freind button here</Text>
   
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
  
    <Text> Post List with add post button</Text>

    <FlatList
                data={this.state.Posts}
                renderItem={({item}) => 
                (
                    <ScrollView>
                      
                      <Button
                      title={item.author.first_name+" "+item.author.last_name+"\n "+item.text+"\n Likes: "+(item.numLikes+"     "+item.timestamp)}
                      onPress={ () => this.props.navigation.navigate('ViewPost',{ items: item}) }
                      />
                      <Text>{this.checkPoster(item.author.user_id,item.post_id)}</Text>
                       

                      <Button
                      title="Like" 
                      onPress={() => {this.LikePost(item.post_id)}}
                      />

                       <Button
                      title="Unlike" 
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

export default Profile;