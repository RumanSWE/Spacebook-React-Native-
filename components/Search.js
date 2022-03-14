import React, {Component} from 'react';
import { View, Text , FlatList ,TextInput,Button,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from './Style';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import UploadDraft from './UploadDraft'

class Search extends Component  {

  constructor(props){
    super(props);
    

  this.state= {
      search: "",
      searchList: [],
      text: ""
    }
  }
  componentDidMount() 
  {
    
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      
      this.checkLoggedIn();
      UploadDraft.dateCheck();
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
  };

  GetSearch = async() =>{

    if (this.state.search == "")
    {
      return this.setState({text: "Error: Cant Search For Nothing"})
    }

    const value = await AsyncStorage.getItem('@session_token');
    
    console.log("hello??");
    this.setState({text: ""})
    
    return fetch("http://localhost:3333/api/1.0.0/search?q="+this.state.search, {
    
      'headers': {'X-Authorization':  value},
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

      this.setState({
      isLoading: false,
      searchList: responseJson
      })
      
      })
      
    
    .catch((error) => {
        console.log(error);
        
    })
  }

  //

render() {

 
    return (
      <ScrollView>
        <TextInput
              placeholder="Search"
              onChangeText={(search) => this.setState({search})}
              value={this.state.search}
              style={Style.inputBox}
        />
        <TouchableOpacity
        onPress={() => this.GetSearch()}
        style={Style.searchBtn}
        >
          <Text style={Style.searchText}>Enter</Text>

        </TouchableOpacity>
        
        <Text style={Style.errorText}>{this.state.text}</Text>
        <FlatList
              data={this.state.searchList}
              renderItem={({item}) => (
                  <View>
                    <TouchableOpacity
                    onPress={ () => this.props.navigation.navigate('Profile',{ id: String(item.user_id)}) }
                    style={Style.buttonStyleDefault}
                    >
                      <Text style={Style.buttonText}>{item.user_givenname+" "+item.user_familyname}</Text>
                    </TouchableOpacity>
                    
                     
                  </View>
              )}
              keyExtractor={(item,index) => item.user_id.toString()}
            />
      </ScrollView>
      
    );
  }
}

export default Search;