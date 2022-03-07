import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Add the ablity to show user profile of requested user and able to click on the name and link to there profile

class ViewDrafts extends Component  {

  constructor(props){
    super(props);
    this.state =
    { 
        texts: [],
        fullDraft: [],
        isLoading: true,
        TextError: "",

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
  deleteDraft = async(index)=>{

    let my_id = await AsyncStorage.getItem('@id'); 

    let delText = this.state.texts[index];

    let list = this.state.fullDraft;

    console.log(list)

    for(let i = 0; i < list.length; i++)
    {
      if((list[i].id == my_id) && (list[i].text == delText))
      {
        list.splice(i, 1);
        AsyncStorage.setItem('draftStore', JSON.stringify(list))

        console.log(await AsyncStorage.getItem('draftStore'),"heleoeo")

        this.getDrafts();

      }
    }

    
  }
  getDrafts = async()=>{
    
    
    let my_id = await AsyncStorage.getItem('@id');  

    let t = await AsyncStorage.getItem('draftStore');  
    let parsed = JSON.parse(t);
    
    this.setState({fullDraft: parsed})

    const textList = [];
    
    if(parsed.length == 0)
    {
      this.setState({texts:[]});
      return this.setState({TextError: "No Saved Drafts , Please Save Draft"})
    }

    for(let i = 0; i < parsed.length; i++)
    {
        if(parsed[i].id == my_id)
        {
            console.log(parsed[i].text);
            textList.push(parsed[i].text);

        }

    }
    
    this.setState({texts: textList})
    this.setState({isLoading: false})

    //this.setState({texts: "hlloe"})
  }
  AddPost = async(index)=>
  {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');

    if(this.state.text == "" )
    {
      return this.setState({TextError: "Please Enter Text"})
    }
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post", {
      method: 'POST',
      headers: {'Content-Type': 'application/json','X-Authorization':  value},
      body: JSON.stringify({
        text: this.state.texts[index],
      })
    })

    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        return response.json()
      }
      else if(response.status === 201){
        this.deleteDraft(index);
        this.getDrafts();
        this.setState({TextError: "Draft Uploaded To Profile"})

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
      if (this.state.isLoading){
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
  
            <Text>Loading</Text>

            <Text>{this.state.TextError}</Text>
            
            
          </View>
        );
      }else{
        return(
        <View>
            
          
            <FlatList
              data={this.state.texts}
              getChildrenName={(data) => 'item'}
              renderItem={({item,index}) => 
              (
                  <ScrollView>

            <TextInput
              onChangeText={this.state.texts[index]}
              value={this.state.texts[index]}
              style={{padding:5, borderWidth:1, margin:5}}
            />
            <Text>{this.state.TextError}</Text>
                    
                    <Button
                    title="delete"
                    onPress={() => {this.deleteDraft(index)}}
                    />

                    <Button
                    title="Upload Now"
                    onPress={() => {this.AddPost(index)}}
                    />

                    <Button
                    title="Schedule Upload"
                    />

                  </ScrollView>
              )}
      />
        </View>
        );
              }
    }
}
export default ViewDrafts