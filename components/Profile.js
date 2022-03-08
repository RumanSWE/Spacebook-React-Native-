import React, {Component} from 'react';
import { View, Text , FlatList ,Button,ScrollView,TextInput,Alert,TouchableOpacity,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationActions } from 'react-navigation';
import Style from "./Style"



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
      falseText: "",
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
    //this.setState({Freinds: false})
    this.setState({Posts: []})

    let my_id = await AsyncStorage.getItem('@id');
    this.setState({LoggedID: my_id})
    
    try 
    {
      const id = this.props.route.params.id;
      console.log("someone elses profile")
      this.setState({id: id})

      this.getFriendList();
      this.ProfilePic();
      this.loadPosts();
      this.getUser();
      
    } 
    catch (error) 
    {
      console.log("this is my own profile");
      this.setState({Freinds: true})
      
      
      this.setState({id: my_id})

      this.getFriendList();
      this.ProfilePic();
      this.loadPosts();
      this.getUser();
      
    }
  }
  getUser= async () => {

    let id = this.state.id;

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
  getFriendList = async () => {

    let id = this.state.id
    
    let value = await AsyncStorage.getItem('@session_token');

    console.log("Freindlist")
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends", {
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
        console.log("200")
        this.setState({
          Freinds: true,
          FriendList: responseJson
        })
       
      }else if(response.status === 401){
        console.log("401")
        this.props.navigation.navigate("Login");
      }
      else if(response.status == 403){
        console.log("403")
        this.setState({
          Freinds: false
        })
        this.FreindStatus();

      }else{
          throw 'Something went wrong';
      }
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
  addFreind = async() =>{
  
  let id = this.state.id;
  let value = await AsyncStorage.getItem('@session_token');
  
  return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends", {
    method: 'POST',
    'headers': {
      'X-Authorization':  value
    }
  })
  .then((response) => {
    if(response.status === 200){
      this.setState({falseText: "Freind Request Sent!"})
        this.FreindStatus;
    }else if(response.status === 401){
      return response.json()
    }else if(response.status == 403)
    {
      this.setState({falseText: "Freind Request Already Sent!"})
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
  

  data = String(data);

  if(data == "add")
  {
    return(
      <View>
        <Button 
        title = "Add Freind"
        onPress={ () => this.addFreind() } 
        />
        <Text>{this.state.falseText}</Text>
      </View>
  );
    
  }
  else if(data == "accept")
  {
    return (
      <View>
      <Button 
        title = "Accept"
        onPress={ () => this.AcceptReq() }

      />
      <Button 
        title = "Decline"
        onPress={ () => this.DeclineReq() }
        
        
      />
      </View>
      );
    }
  }
  AcceptReq = async() =>{
    
    let id = this.state.id;
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id, {
      method: 'POST',
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
        window.location.reload(false);
          return response.json()
      }else if(response.status === 401){
        return response.json()
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      
      console.log(responseJson);
      this.setState({Type: ""})
      this.setState({Freinds: true})
      this.userCheck();
      
      })
      
    
    .catch((error) => {
        console.log(error,"Accept Failed");
        
    })
  }
  DeclineReq = async() =>{

    let id = this.state.id;
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
      this.userCheck();
      })

      
    
    .catch((error) => {
        console.log(error);
        
    })
  
  }
  loadPosts = async() =>{

    console.log("Load posts")
    
    let id = this.state.id
    console.log("herewijdijidjiajdi",id)

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
      
      console.log(responseJson,"all post resposnes!!!!!!!!!!!")
      if(responseJson == "" )
      {
        console.log("goodbye")
        this.setState({
          Posts: [],
          isLoading: false
        })
        
        this.setState({TextError: "No Posts On Your Profile"})
      }
      else if(responseJson != "")
      {
        console.log("hello??")
        this.setState({
          Posts: responseJson,
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
        this.loadPosts();
        
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
    const id = this.state.LoggedID;
    const post_id = item.post_id;

      return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+post_id+"/like", {
        method: 'POST',
        headers: {'Content-Type': 'application/json','X-Authorization':  value},
      
      })
  
      .then((response) => {
        if(response.status === 200){
            this.loadPosts()
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
          this.loadPosts()
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

    if(draft.text == "")
    {
      return this.setState({TextError: "No Text Has Been Inputted"})
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
            const newArr2 = JSON.parse(prev)
            newArr2.push(draft);
            AsyncStorage.setItem('draftStore', JSON.stringify(newArr2));
          }
         
      });  
    
    this.setState({TextError: "Draft Saved!"})

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
  
  if(this.state.isLoading){
    return (
      <View style={Style.centerText}>
        <Text>Loading...</Text>
      </View>
    );
  }
  else{

    if (this.state.Freinds == false){
      return (
        <View
          style={Style.centerText}>

         
          
          <Image
          
          source={{ 
            uri: this.state.photo
          }}

          style={{ 
            height: 100,
            width: 100,
            borderRadius: 50}}
          />

        <Text style={{ }}>{this.state.User.first_name} {this.state.User.last_name} </Text>

          <Text>{this.FreindButtonStatus(this.state.Type)}</Text>
          
        </View>
      );
    }else{
    return(
      <ScrollView>
      

      
      <View style={{justifyContent: 'center',
            alignItems: 'center'}}>

      <Image
      
        source={{ 
          uri: this.state.photo
        }}

      style={{ 
        height: 100,
        width: 100,
        borderRadius: 50}}
      />

      <Text style={{fontWeight: 'bold',fontSize: 25}}>{this.state.User.first_name} {this.state.User.last_name} </Text>
      </View>
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
      
      


      <Text style={{fontWeight: 'bold',fontSize: 20}}>Friends List:</Text>

      <Button
      title="Freinds List"
      onPress={() => this.props.navigation.navigate('ProfileFriends',{ id: this.state.id})}

      />
 
 <Text>Posts:</Text>
      <FlatList
      
                data={this.state.Posts}
                
                renderItem={({item}) => 
                
                (
                  
                    <ScrollView  style={{borderWidth: 1,backgroundColor: "white"}}>

                    <View style={{flexDirection:'row'}}>

                    <Text>{item.author.first_name+" "+item.author.last_name}</Text>
                    <Text>{this.DateGet(item.timestamp)}</Text>
                       
                    
                    {this.state.LoggedID == item.author.user_id &&
                     
                     <View style={{ flexDirection:"row", justifyContent: 'flex-end'}}>
                     <View>
                     <Button 
                       title="Edit"
                       onPress={ () => this.props.navigation.navigate('Post',{item: item}) }

                       
                     />
                     </View>
                     <View>
                     <Button 
                       title="Delete"
                       onPress={ () => this.DeletePost(item.post_id)}
                       color="#e60e0e"
                     />
                     
                     </View>
                   </View>
                   }
                   </View>
                      <Button

                      title={item.text+"\n Likes: "+item.numLikes}
                      onPress={ () => this.props.navigation.navigate('ViewPost',{items: item,id: this.state.id}) }
                      />
                  
                 

                     
                      {this.state.LoggedID != item.author.user_id &&
                       

                      <View style={{ flexDirection:"row" }}>
                        <View>
                          <Button
                          title="Like" 
                          onPress={() => {this.LikePost(item)}}
                          />
                        </View>
                        <View>
                          <Button
                          title="Remove Like" 
                          onPress={() => {this.UnlikePost(item)}}
                          />
                        </View>
                      </View>
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
  }

export default Profile;