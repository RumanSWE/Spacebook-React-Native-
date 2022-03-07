saveDraft = async(index)=> {

    let id = await AsyncStorage.getItem('@id'); 
    let oldText = this.state.initialText[index];
    let curText = this.state.texts[index];
    let list = this.state.fullDraft

    

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
          
          this.setState({initialText: this.state.texts})
          this.setState({fullDraft: list})
          AsyncStorage.setItem('draftStore', JSON.stringify(list))

          //this.props.navigation.navigate('Profile');
          //refresh page
          console.log("works")
          window.location.reload("ViewDrafts");


        }
      }

    }



  }