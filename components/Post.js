import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TextInput,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from './Style';
import UploadDrafts from './UploadDraft'

//Add the ablity to show user profile of requested user and able to click on the name and link to there profile

class Post extends Component  {

  constructor(props){
    super(props);
    this.state =
    { 
      text: "",
      errorText: "",
      post_id: "",
      id: "",
    }
  }
  async componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
      UploadDrafts.dateCheck();
      this.setState({text: this.props.route.params.item.text}) 
      this.setState({post_id: this.props.route.params.item.post_id })
      this.setState({id: this.props.route.params.id })
     
     
      
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

  SavePost = async()=>
  {
 

  const value = await AsyncStorage.getItem('@session_token');

  
  const id = this.state.id
  const post_id = this.state.post_id
  
  const Text = String(this.state.text);
  console.log(Text)
  if(Text == "")
  {
    return this.setState({errorText: "Error: Please Enter Text"})
  }

  return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+post_id, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json','X-Authorization':  value},
    body: JSON.stringify({
      text: Text,
    })
  })
  .then((response) => {
    if(response.status === 200){
        this.setState({errorText:"Changes Saved To Post"})
        return response.json()
    }else if(response.status === 401){
      return response.json()
    }else if (response.status == 403){
      this.setState({errorText: "Error: Bad Data / Missing Fields"})


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

  render(){
      return(
        <View> 
          
          <TouchableOpacity
               onPress={() => this.props.navigation.goBack()} 
               style={Style.searchBtn}
              >
                <Text style={Style.searchText}>Back</Text>
                
              </TouchableOpacity>
        
        <TextInput
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              style={Style.inputBox}
        />
      
              <TouchableOpacity
               onPress={() => {this.SavePost()}}
               style={Style.buttonStyleDefault}
              >
                <Text style={Style.buttonText}>Save Changes</Text>
                
              </TouchableOpacity>

        <Text style={Style.errorText}>{this.state.errorText}</Text>

          </View>
        

      );
  }
}
  export default Post;