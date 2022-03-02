import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Add the ablity to show user profile of requested user and able to click on the name and link to there profile

class Post extends Component  {

  constructor(props){
    super(props);
    this.state =
    { 
      text: this.props.route.params.item.text,
    }
  }
  async componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
     
      
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
  const id = await AsyncStorage.getItem('@id');

 
  const post_id = this.props.route.params.item.post_id;
  console.log(this.state.text)

  return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+post_id, {
    method: 'PATCH',
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
        <Button 
        title="back"
        onPress={() => this.props.navigation.goBack()} 
        />
        
        <TextInput
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              style={{padding:5, borderWidth:1, margin:5}}
        />
        <Button
        title="Save"
        onPress={() => {this.SavePost()}}/>

          </View>
        

      );
  }
}
  export default Post;