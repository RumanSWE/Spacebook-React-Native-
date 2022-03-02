import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Add the ablity to show user profile of requested user and able to click on the name and link to there profile

class ViewPost extends Component  {

  constructor(props){
    super(props);
    this.state =
    { 
      post: "",
      isLoading: true
    }
  }
  async componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
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
    const userid = items.author.user_id;
    
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+userid+"/post/"+postid, {
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
            <Text>Loading..</Text>
          </View>
        );
      }else{
    return(
        <View>
            <Text>{this.state.post.author.first_name+" "+this.state.post.author.last_name}</Text>
            <Text>{this.state.post.timestamp}</Text>
            <Text>{this.state.post.text}</Text>
            <Text>{this.state.post.numLikes} Likes</Text>
            
        </View>
    );
      }
}
}
export default ViewPost;