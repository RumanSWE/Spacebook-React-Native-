import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Add the ablity to show user profile of requested user and able to click on the name and link to there profile

class ViewDrafts extends Component  {

  constructor(props){
    super(props);
    this.state =
    { 
        texts: ""

    }
  }
  async componentDidMount() 
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
      this.getDrafts()
    
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
  getDrafts = async()=>{
    console.log("works")
    let my_id = await AsyncStorage.getItem('@id');  

    let t = await AsyncStorage.getItem('draftStore');  
    let parsed = JSON.parse(t);  

    const textList = [];

    for(let i = 0; i < parsed.length; i++)
    {
        if(parsed[i].id == my_id)
        {
            console.log(parsed[i].text);
            textList.push(parsed[i].text);

        }

    }
    console.log(textList)
    this.setState({texts: textList})

    //this.setState({texts: "hlloe"})
  }
    render(){
        return(
        <View>
            <Text> View , Edit , Delete and Upload drafts here</Text>
            <Text>{this.state.text}</Text>
        </View>
        );
    }
}
export default ViewDrafts