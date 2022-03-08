import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button,TextInput  } from 'react-native';
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
        initialText: [],
        date: "",
        time: "",

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
    let get = await AsyncStorage.getItem('draftStore');  
    let parsed = JSON.parse(get);

    console.log(parsed)
    
    
    this.setState({fullDraft: parsed})

    let textList = [];
    let other = [];
    
    if(parsed.length == 0)
    {
      this.setState({texts:[]});
      return this.setState({TextError: "No Saved Drafts , Please Save Draft"})
    }

    for(let i = 0; i < parsed.length; i++)
    {
        if(parsed[i].id == my_id)
        {
            textList.push(parsed[i].text);
            other.push(parsed[i].text);
        }

    }

    this.setState({initialText: other})
    this.setState({texts: textList})
    
   
    this.setState({isLoading: false})

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
  saveDraft = async(index)=> 
  {

    let id = await AsyncStorage.getItem('@id'); 
    
    let curText = this.state.texts[index];
    let list = this.state.fullDraft
    let oldText = this.state.initialText[index];

    if(curText == "")
    {
      return
    }
    else 
    {
      for(let i = 0; i < list.length; i++)
      {
        if((list[i].id == id) && (list[i].text == oldText))
        {
          list[i].text = curText;
          
          let initialText = this.state.initialText;
          initialText[index] = curText;
          this.setState({initialText})

          this.setState({fullDraft: list})
          console.log(list[i].text)
          console.log(list)
          AsyncStorage.setItem('draftStore', JSON.stringify(list))

        }
      }

    }



  }
  setDate = async () =>
  {
      let curDate = new Date()
      let ShortCurdate = curDate.getDate()+"/"+(curDate.getMonth()+1)+"/"+curDate.getFullYear()
      
      let time = this.state.time;


      let date = new Date(String(this.state.date));
      console.log(date.toLocaleString())

      if(date == "invalid date")
      {
        return 
      }
      else
      {

      }

      
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
            <Button 
              title="Back"
              onPress={() => this.props.navigation.goBack()} 
            />
  
            <Text>Loading</Text>

            <Text>{this.state.TextError}</Text>
            
            
          </View>
        );
      }else{
        return(
        <View>
              
          

               

              <Button 
              title="Back"
              onPress={() => this.props.navigation.goBack()} 
              />
          
            <FlatList
              data={this.state.texts}
              getChildrenName={(data) => 'item'}
              renderItem={({item,index}) => 
              (
            <ScrollView>

            

            <TextInput
             onChangeText={text => {
              let texts  = this.state.texts;
              texts[index] = text;
              this.setState({texts});
            }}
              value={this.state.texts[index]}
              style={{padding:5, borderWidth:1, margin:5}}
            />
            <Text>{this.state.TextError}</Text>

                    <Button
                    title="Save Edit To Storage"
                    onPress={() => {this.saveDraft(index)}}
                    />
                    
                    <Button
                    title="delete"
                    onPress={() => {this.deleteDraft(index)}}
                    />

                    <Button
                    title="Upload Now"
                    onPress={() => {this.AddPost(index)}}
                    />
                    <TextInput 
                    placeholder='DD/MM/YYYY'
                    value={this.state.date}
                    onChangeText={(date) => this.setState({ date })}
                    style={{padding:5, borderWidth:0.5, margin:5}}
                    
                    />

                    <TextInput 
                    placeholder='HH:MM'
                    onChange={this.state.time}
                    style={{padding:5, borderWidth:0.5, margin:5}}
                    
                    />
                    <Button
                    title="Schedule Upload"
                    onPress={() => this.setDate()}
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