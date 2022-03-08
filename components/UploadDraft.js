import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TextInput  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';







//Add the ablity to show user profile of requested user and able to click on the name and link to there profile
class UploadDraft extends Component  {



  constructor(props){
    super(props);
    this.state =
    { 
        texts: [],
        fullDraft: [],
        isLoading: true,
        TextError: "",
        initialText: [],

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
  setDate = async () =>
  {
      let curDate = new Date()
      let date = curDate.getDate()+"/"+(curDate.getMonth()+1)+"/"+curDate.getFullYear()
      console.log(date)
  }

  
  render(){
      return (
        <View>
            <Text>Hlooo</Text>
            <TextInput
            
            />
      </View>
      );
            }
  }

export default UploadDraft