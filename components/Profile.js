import React, {Component} from 'react';
import { View, Text , FlatList ,Button,ScrollView,TextInput,Alert,TouchableOpacity,Image} from 'react-native';
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
      Freinds: null,
      id: "",
      LoggedID: "",
      Posts: [],
      text: "",
      isLoading: true,
      myPost: null,
      photo: null,
      TextError: "",
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
    

    if (value == null) 
    {
        this.props.navigation.navigate('Login');
    }
  }
  userCheck= async() =>
  {
    const my_id = await AsyncStorage.getItem('@id');
    this.setState({LoggedID: my_id})
    
    try 
    {
      console.log("someone elses profile")
      const id = this.props.route.params.id;
      this.setState({id: id})

      this.getFriendList(id);
      this.ProfilePic(id);
      this.getUser(id);
     
      
      
    } 
    catch (error) 
    {
      console.log("this is my own profile");
      this.setState({Freinds: true})
      
      //const my_id = await AsyncStorage.getItem('@id');
      this.setState({id: my_id})

      this.getFriendList(my_id);
      this.ProfilePic(my_id);
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
    
    const value = await AsyncStorage.getItem('@session_token');
    //const id = await AsyncStorage.getItem('@id');
    
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
      }
      else if(response.status == 403){
        this.setState({
          Freinds: false
        })
        this.FreindStatus();
        return response.json()

      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
    console.log("nope")
    this.setState({
      Freinds: true,
      FriendList: responseJson,
      isLoading: true,
    })
    this.loadPosts(id);
    //console.log(this.state.FriendList ,"freind list")
    
    
  })
  .catch((error) => {
      console.log(error);
      
  })
  }
  FreindStatus= async() =>
  {
    const id = this.state.id;
    
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

    console.log("freind status ran")

    if(responseJson.length == 0)
    {
     
      
      this.setState({
        Type: "add",
        })
    }

    for(let i = 0; i < responseJson.length; i++)
    {
      if (responseJson[i].user_id == id)
      {
        
        this.setState({
          Type: "accept",
          })
      }
      else
      {
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
        this.FreindStatus;
        return response.json()
    }else if(response.status === 401){
      return response.json()
    }else if(response.status == 403)
    {
      this.FreindButtonStatus(this.setState({Type: "sent"}))
      return response.json()
    }else{
        throw 'Something went wrong';
    }
  })
  .then((responseJson) => {
    console.log(responseJson);

    //this.props.navigation.navigate("Home");
    })
    
  
  .catch((error) => {
      console.log(error);
      
  })
  }
  FreindButtonStatus= (data) =>
{
  console.log(data)
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
    else if(data = "sent")
    {
      return(
        
        <View>
        <Button 
        title = "Add Freind"
        onPress={ () => this.addFreind(id) } 
            />
        <Text> Freind Request Already Sent! </Text>
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
      window.location.reload(false);
      this.setState({Type: ""})
      this.setState({Freinds: true})
      
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
      this.setState({Type: "add"})
      window.location.reload(false);
      })

      
    
    .catch((error) => {
        console.log(error);
        
    })
  
  }
  loadPosts = async(id) =>{


    const value = await AsyncStorage.getItem('@session_token');
    console.log(id)

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
      
      
      if(responseJson == "" )
      {
        console.log("no posts")
       

        this.setState({Posts: responseJson,
          isLoading: false
        })
      }
      else if(responseJson != "")
      {
       
        this.setState({Posts: responseJson,
        isLoading: false
      })
      }

    })
    .catch((error) => {
        console.log(error);
    
    })
  }
  DeletePost = async(Post_id)=>
  {
    console.log("DELETING")
    const value = await AsyncStorage.getItem('@session_token');
    const id = this.state.LoggedID;
    
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
      return this.setState({TextError: "Please Enter Text"})
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
        this.loadPosts(this.state.id)
        
        Alert.alert("Post Uploaded")

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
  LikePost = async(item)=>
  {
    const value = await AsyncStorage.getItem('@session_token');
    const id = this.state.id;
    const post_id = item.post_id;

      return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+post_id+"/like", {
        method: 'POST',
        headers: {'Content-Type': 'application/json','X-Authorization':  value},
      
      })
  
      .then((response) => {
        if(response.status === 200){
            this.loadPosts(this.state.id)
            return response.json()
        }else if(response.status === 401){
          return response.json()
        }
        else if (response.status == 403){
          Alert.alert("You Already Liked This Post!")
        
        }else{
            throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        //this.setState({like: "unlike"})
        })
        
      
      .catch((error) => {
          
          console.log(error);
          
      })
  }
  UnlikePost = async(item)=>
  {
    const value = await AsyncStorage.getItem('@session_token');
    const id = item.author.user_id;
    const post_id = item.post_id;

    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+post_id+"/like", {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json','X-Authorization':  value},
    
    })

    .then((response) => {
      if(response.status === 200){
          this.loadPosts(this.state.id)
          return response.json()
      }else if(response.status === 401){
        return response.json()
       } else if(response.status == 403){
      Alert.alert("You have not liked this post!")
      
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
  ProfilePic = async()=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = this.state.id;

    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/photo", {
      method: 'GET',
      headers: {
       'X-Authorization':  value
      }
    })
    .then((res) => {
      
      return res.blob();
  
    })
    .then((resBlob) => {
      Alert("hellO??")
      let data = URL.createObjectURL(resBlob);
      this.setState({
        photo: data
      })
    })
    .catch((error) => {
        console.log(error);
    
    })

  }
  SaveDraft = async()=>{

    

    let draft = {  
      id: String(this.state.LoggedID),  
      text: String(this.state.text)
    }  

      const prev = [];
      await AsyncStorage.getItem('draftStore')
      
      .then((prev) => {
          if (prev == null)
          {
            const newArr =[];
            newArr.push(draft)
            AsyncStorage.setItem('draftStore', JSON.stringify(newArr));
          }
          else
          {
            const newArr = JSON.parse(prev)
            newArr.push(draft);
            AsyncStorage.setItem('draftStore', JSON.stringify(newArr));
          }
         
      });  
    
    this.setState({TextError: "Draft Saved!"})
   

    console.log(await AsyncStorage.getItem('draftStore'))
    


  }
  DelDraft = async()=>{

    await AsyncStorage.removeItem('draftStore');
    console.log("deleted")
    console.log(await AsyncStorage.getItem('draftStore'))


  }

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
          
          <Image
          
          source={{ 
            uri: this.state.photo
          }}

          style={{ 
            height: 100,
            width: 100,
            borderRadius: 50}}
          />

          <Text>{this.FreindButtonStatus(this.state.Type)}</Text>
          
        </View>
      );
    }else{
    return(
      <ScrollView>
      

      <Text>{this.state.User.first_name} {this.state.User.last_name} </Text>

      <Image
      
        source={{ 
          uri: this.state.photo
        }}

      style={{ 
        height: 100,
        width: 100,
        borderRadius: 50}}
      />
      
      <TextInput
              placeholder="Type New Post Here..."
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              style={{padding:5, borderWidth:1, margin:5}}
        />
      <Text>{this.state.TextError}</Text>
      <Button 
        title="Add New Post"
        onPress = {() => {this.AddPost()}}
      />

      {this.state.id == this.state.LoggedID &&  
      <Button
      title="Save Draft"
      onPress={() => {this.SaveDraft()}}
      />
      }
      
      {this.state.id == this.state.LoggedID &&  
      <Button
      title="View Drafts"
      onPress={ () => this.props.navigation.navigate('ViewDrafts') }
      />
      }
      
      


      <Text>Friends List:</Text>
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
 
 <Text>Posts:</Text>
      <FlatList
      
                data={this.state.Posts}
                
                renderItem={({item}) => 
                
                (
                  
                    <ScrollView>

                      
                    <Text> </Text>
                      <Button
                      title={item.author.first_name+" "+item.author.last_name+"\n "+item.text+"\n Likes: "+(item.numLikes+"     "+item.timestamp)}
                      onPress={ () => this.props.navigation.navigate('ViewPost',{items: item}) }
                      />

                    {this.state.LoggedID == item.author.user_id &&
                     <Button 
                        title="Edit"
                        onPress={ () => this.props.navigation.navigate('Post',{item: item}) }
                        
                      />
                    }
                    
                    {this.state.LoggedID == item.author.user_id &&
                      <Button 
                        title="Delete"
                        onPress={ () => this.DeletePost(item.post_id)}
                      />
                    }


                      {this.state.LoggedID != item.author.user_id &&
                      <Button
                      title="Like" 
                      onPress={() => {this.LikePost(item)}}
                      />
                      }
                      {this.state.LoggedID != item.author.user_id &&
                       <Button
                      title="Remove Like" 
                      onPress={() => {this.LikePost(item)}}
                      />
                      }

                    </ScrollView>
                )}
                keyExtractor={(item,index) => item.author.user_id.toString()}
              />
              </ScrollView>
        );
      }
    }
  }

export default Profile;