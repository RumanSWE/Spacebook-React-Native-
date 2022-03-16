import { WhiteBalance } from 'expo-camera/build/Camera.types'
import { StyleSheet } from 'react-native'
import { color } from 'react-native-reanimated'

export default StyleSheet.create({
  Colors:
  {
    primary: '#226B74',
    secondary: '#254B5A',
    tertiary: '#5DA6A7',
    darkLight: '#254B5A',
    brand: '#254B5A',
    green: '#254B5A',
    red: '#254B5A'
  },
  welcome:
  {
    justifyContent: 'center',
    flex: 1

  },
  centerText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  homeButton: {
    borderRadius: 30,
    padding: 10,
    backgroundColor: 'dodgerblue'
  },
  buttonStyleDefault:
{

  borderRadius: 30,
  padding: 10,
  marginHorizontal: 15,
  marginVertical: 10,
  backgroundColor: 'dodgerblue'

},
  inputBox: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    fontWeight: '500'
  },

  buttonText:
{
  textAlign: 'center',
  color: 'white',
  fontWeight: 450

},
  titleText: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center'
  },
  searchBtn:
{
  borderRadius: 30,
  borderWidth: 2,
  padding: 10,
  marginHorizontal: 15,
  marginVertical: 10,
  borderColor: 'dodgerblue',
  backgroundColor: 'white'
},
  searchText:
{
  textAlign: 'center',
  color: 'black',
  fontWeight: 450

},
  errorText:
{
  textAlign: 'center',
  fontWeight: '700',
  color: 'red'
},
  AcceptButton: {
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 15,
    backgroundColor: 'green'
  },
  AcceptText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 450
  },
  DeclineButton: {
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: 'red'
  },
  DeclineText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 450
  }

})
