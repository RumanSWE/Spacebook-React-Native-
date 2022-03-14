import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TextInput,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from './Style'
import UploadDrafts from './UploadDraft'
//Add the ablity to show user profile of requested user and able to click on the name and link to there profile

class ViewPost extends Component  {

  constructor(props){
    super(props);
    this.state =
    { 
      post: "",
      isLoading: true,
      
    }
  }
  async componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
      UploadDrafts.dateCheck();
      this.GetSinglePost(this.props.route.params.items);
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
  };
  GetSinglePost = async (items) => {

    const postid = items.post_id;    
    const id = this.props.route.params.id
    
    
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+postid, {
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Profile");
      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
    this.setState({
      post: responseJson,
      isLoading: false,
    })
    
    
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
              <TouchableOpacity
               onPress={() => this.props.navigation.goBack()} 
               style={Style.searchBtn}
              >
                <Text style={Style.searchText}>Back</Text>
                
              </TouchableOpacity>
            <Text>Loading..</Text>
          </View>
        );
      }else{
    return(
        <View>
              <TouchableOpacity
               onPress={() => this.props.navigation.goBack()} 
               style={Style.searchBtn}
              >
                <Text style={Style.searchText}>Back</Text>
                
              </TouchableOpacity>

            <Text style={{textAlign:'center',fontWeight:'800',fontSize:20}}>{this.state.post.author.first_name+" "+this.state.post.author.last_name+"\n"+this.state.post.timestamp}</Text>
            
            <Text style={{textAlign:'center',fontWeight:'400',fontSize:15,paddingTop:20}}>{this.state.post.text}</Text>
            <Text style={{textAlign:'left',paddingLeft: 30,fontWeight:'600'}}>{this.state.post.numLikes} Likes</Text>
            
        </View>
    );
      }
}
}
export default ViewPost;