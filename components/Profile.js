import React, {Component} from 'react';
import { View, Text , FlatList ,Button,ScrollView,TextInput,Alert,TouchableOpacity,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationActions } from 'react-navigation';
import Style from "./Style"
import UploadDraft from './UploadDraft'



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
      UploadDraft.dateCheck();


      try
      {      
      this.setState({isLoading: true})
      this.setState({Posts: []})
      this.setState({Freinds: null})
      this.setState({Type: ""})
      }
      catch(e)
      {console.log(e)}

      
      this.userCheck();


      
    }); 
  }
  async componentWillUnmount() 
  {
    console.log("---will mont------")
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

    let my_id = await AsyncStorage.getItem('@id');
    this.setState({LoggedID: my_id})
    
    try 
    {
      const id = this.props.route.params.id;
      console.log("someone elses profile (IGNORE)")
      this.setState({id: id})

      this.getFriendList();
      this.ProfilePic();
      this.loadPosts();
      this.getUser();
      
    } 
    catch (error) 
    {
      console.log("this is my own profile (IGNORE)");
      this.setState({Freinds: true})
      
      
      this.setState({id: my_id})

      this.getFriendList();
      this.ProfilePic();
      this.loadPosts();
      this.getUser();
      
    }
  }
  getUser= async () => {
    console.log("get user")

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

    console.log("getFreindlist")
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends", {
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      //console.log(response.json())
      if(response.status === 200){
     
        this.setState({
          Freinds: true,
          FriendList: response.json()
        })
       
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }
      else if(response.status == 403){

        console.log("not freinds")
        
        this.setState({
          Freinds: false,
          isLoading: false
        })
        console.log("get freinds list")
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
    console.log("freindStatus")
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
    console.log("addFreind")
  
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
        console.log("add Freind")
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

  

  data = String(data);

  if(data == "add")
  {
    return(
      <View>

        <TouchableOpacity
        onPress={ () => this.addFreind() } 
        style={Style.buttonStyleDefault}
        >
        <Text style={Style.buttonText}>Add Freind</Text>
        </TouchableOpacity>

        <Text>{this.state.falseText}</Text>
      </View>
  );
    
  }
  else if(data == "accept")
  {
    return (
      <View>
        <TouchableOpacity
         onPress={ () => this.AcceptReq() }
         style={Style.AcceptButton}
        >
          <Text style={Style.AcceptText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={ () => this.DeclineReq() }
        style={Style.DeclineButton}

        >
          <Text style={Style.DeclineText}>Decline</Text>
        </TouchableOpacity>

      
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

        this.getFriendList();
        this.forceUpdate();
          
          return response.json()
      }else if(response.status === 401){
        this.getFriendList();
        this.forceUpdate();
        
        return response.json()
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.getFriendList();
      this.forceUpdate();
      
      
      
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
        this.getFriendList();
        this.forceUpdate();
      }else if(response.status === 401){
        this.getFriendList();
        this.forceUpdate();
        return response.json()
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.getFriendList();
        this.forceUpdate();
      })

      
    
    .catch((error) => {
        console.log(error);
        
    })
  
  }
  loadPosts = async() =>{

    console.log("Load posts")
    
    let id = this.state.id
  
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
      
      if(responseJson == "" )
      {
        
        this.setState({
          Posts: [],
          isLoading: false
        })
       
        
        this.setState({TextError: "No Posts Available"})
      }
      else if(responseJson != "")
      {

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
    const id = this.state.id;
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+Post_id, {
      method: 'DELETE',
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200)
      {
        this.loadPosts()
      }
      else if(response.status === 401){
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
    console.log("AddPost")
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
        this.setState({falseText: "Post Uploaded!"})
        this.loadPosts();
        
        

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
      text: String(this.state.text),
      date: null
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
      let hours = (Math.ceil(diff / (1000 * 60 * 60)));

      if(hours <= 1)
      {
        return (Math.ceil(diff / (1000 * 60)) +" Min Ago");
      }
      else
      {
        return(Math.ceil(diff / (1000 * 60 * 60))+" Hours Ago");
      }

     
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

        <Text style={Style.titleText}>{this.state.User.first_name} {this.state.User.last_name} </Text>

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
        marginTop: 50,
        marginBottom: 15,
        height: 100,
        width: 100,
        borderRadius: 50}}
      />

      <Text style={Style.titleText}>{this.state.User.first_name} {this.state.User.last_name} </Text>
      </View>
      <TextInput
              placeholder="Type New Post Here..."
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              style={Style.inputBox}
        />
      <Text style={Style.errorText}>{this.state.TextError}</Text>

    <View style={{flexDirection:'row', justifyContent: 'space-between',padding:15}}>

      <TouchableOpacity
      onPress = {() => {this.AddPost()}}
      style={Style.homeButton}
      >
        <Text style={{color:'white'}}>Upload Post</Text>
      </TouchableOpacity>

      {this.state.id == this.state.LoggedID && 

      <TouchableOpacity
       onPress={() => {this.SaveDraft()}}
       style={Style.homeButton}
      >
        <Text style={Style.buttonText}>Save Draft</Text>
      </TouchableOpacity>
    }
    {this.state.id == this.state.LoggedID && 

      <TouchableOpacity
      onPress={ () => this.props.navigation.navigate('ViewDrafts') }
      style={Style.homeButton}
      >
        <Text style={Style.buttonText}>View Drafts</Text>
      </TouchableOpacity>

      }
      </View>

      <TouchableOpacity
      onPress={() => this.props.navigation.navigate('ProfileFriends',{ id: this.state.id})}
      style={Style.buttonStyleDefault}
      >
        <Text style={Style.buttonText}>View Freinds List</Text>

      </TouchableOpacity>
 
      <FlatList
                //horizontal={true}
                contentContainerStyle={{
                  paddingLeft: 15,
                  paddingRight: 15, // THIS DOESN'T SEEM TO BE WORKING
                  marginBottom: 20,
                  
        
            
                }}
                
                data={this.state.Posts}
                
                renderItem={({item}) => 
                
                (
                  
                    <ScrollView  style={{backgroundColor: "white",borderRadius: 15,marginTop:20}}>

                    <View style={{flexDirection:'row', justifyContent: 'space-between',paddingTop:20}}>
        

                    <Text style={{color: "grey",fontWeight: 'bold',fontSize: 15,paddingLeft: 10}}>{item.author.first_name+" "+item.author.last_name+"\n"+(this.DateGet(item.timestamp))}</Text>
                       
                    
                    {this.state.LoggedID == item.author.user_id &&
                     
                     <View style={{ flexDirection:"row", justifyContent: 'flex-end'}}>
                     <View>
                     <TouchableOpacity 
                     style={{backgroundColor: "white" }}
                     onPress={ () => this.props.navigation.navigate('Post',{item: item,id: this.state.id}) }
                     >

                         <Text style={{color:'black',fontWeight:'700',paddingRight:20,paddingLeft:20}}>Edit</Text>
                    </TouchableOpacity>

                     </View>
                     <View>
                     <TouchableOpacity style={{backgroundColor: "white" }}  
                     onPress={ () => this.DeletePost(item.post_id)}
                     >
                      <Text style={{color:'red',fontWeight:'700',paddingRight:20}}>Delete</Text>
                       </TouchableOpacity>
                     
                     </View>
                   </View>
                   }
                   </View>
                   <TouchableOpacity style={{backgroundColor: "white" }} 
                    onPress={ () => this.props.navigation.navigate('ViewPost',{items: item,id: this.state.id}) }
                    >
                      <Text style={{color: "black",paddingLeft:20,paddingRight:20,paddingBottom:20,paddingTop:20}}>{item.text}</Text>
 
                    </TouchableOpacity>
                  
                 

                     
                      {this.state.LoggedID != item.author.user_id &&
                       

                      <View style={{ flexDirection:"row" }}>
                        <View>

                        <TouchableOpacity style={{backgroundColor: "white" }} 
                           
                          onPress={() => {this.LikePost(item)}}
                          >
                            <Text style={{color: "green",paddingLeft:20,paddingRight:20,paddingBottom:20,paddingTop:20}}>Like {item.numLikes}</Text>
                             </TouchableOpacity>

                        </View>
                        <View>

                          <TouchableOpacity style={{backgroundColor: "white" }} 
                          title="Remove Like" 
                          onPress={() => {this.UnlikePost(item)}}
                          >
                            <Text style={{color: "red",paddingLeft:20,paddingRight:20,paddingBottom:20,paddingTop:20}} >Remove Like</Text>
                             </TouchableOpacity>

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