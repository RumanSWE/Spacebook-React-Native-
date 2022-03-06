import React, {Component} from 'react';
import { View, Text , FlatList ,TextInput,Button,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <View>
        <TextInput
              placeholder="Search"
              onChangeText={(search) => this.setState({search})}
              value={this.state.search}
              style={{padding:5, borderWidth:1, margin:5}}
        />
         <Button
            title="Search"
            onPress={() => this.GetSearch()}
        />
        <Text>{this.state.text}</Text>
        <FlatList
              data={this.state.searchList}
              renderItem={({item}) => (
                  <View>
                    <Button style={{ color:"red",padding:5, borderWidth:1, margin:5}} 
                    title={item.user_givenname+" "+item.user_familyname}
                    onPress={ () => this.props.navigation.navigate('Profile',{ id: String(item.user_id)}) }/>
                     
                  </View>
              )}
              keyExtractor={(item,index) => item.user_id.toString()}
            />
      </View>
      
    );
  }
}

export default Search;