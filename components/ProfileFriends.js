import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from './Style'
import UploadDraft from './UploadDraft'

class ProfileFriends extends Component  {

  constructor(props){
    super(props);
    this.state =
    { 
      isLoading: true,
      FriendList: [],
      id: this.props.route.params.id,
    }
  }
  componentDidMount() 
  {
   
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
      UploadDraft.dateCheck();
      this.getFriendList();
    });
   
   
  }
  
  componentWillUnmount()
  {
    this.unsubscribe();
  }

  checkLoggedIn = async () => 
  {
    const value = await AsyncStorage.getItem('@session_token');
    //console.log(value)

    if (value == null) 
    {
        this.props.navigation.navigate('Login');
    }
  };

  getFriendList = async () => {
    
    let id = this.state.id
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends", {
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
    this.setState({
      
      FriendList: responseJson,
      isLoading: false,
    })
    
    
  })
  .catch((error) => {
      console.log(error);
      
  })
  }

  render()
 
    {

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

             <Text style={Style.titleText}>Friends List</Text>
             <FlatList
                data={this.state.FriendList}
                getChildrenName={(data) => 'item'}
                renderItem={({item}) => 
                (
                    <ScrollView>
                      <Text></Text>
                      <TouchableOpacity
                      onPress= { () => this.props.navigation.navigate('Profile',{id: item.user_id}) }
                      style={Style.buttonStyleDefault}
                      >
                        <Text style={Style.buttonText}>{item.user_givenname+" "+item.user_familyname}</Text>
                        
                      </TouchableOpacity>

                    </ScrollView>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
                />


              </View>
              );
        }
  
        
      }        
      
  
  
}

export default ProfileFriends;