// app/index.js

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  Navigator
} from 'react-native';

import FriendList from './FriendList';
import RequestList from './RequestList';
import EntryList from './EntryList';

export default class FriendsTab extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      friendList: [{username:"test", fullname:"test"}],
      pendingRequests: []
    };
  };

  componentWillMount(){
    this.getFriends();
    this.getFriendRequests();
  }

  getFriends(){
    AsyncStorage.getItem('@MySuperStore:token', (err, token) => {
      fetch('http://localhost:3000/api/friends', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      })
      .then( resp => { resp.json()
        .then( json => {
          this.setState({
            friendList: json
          })
        })
        .catch((error) => {
          console.warn("fetch error on getrequest:", error)
        });
      });
    });
  }

  getFriendRequests(){
    AsyncStorage.getItem('@MySuperStore:token', (err, token) => {
      fetch('http://localhost:3000/api/friendreq', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      })
      .then( resp => { resp.json()
        .then( json => {
          console.log(json, "myjson");
          this.setState({
            pendingRequests: json
          })
        })
        .catch((error) => {
          console.warn("fetch error on getrequest:", error)
        });
      });
    });
  }

  acceptFriendRequest(requestId){
    console.log(requestId, typeof requestId, 'accepted!')
    AsyncStorage.getItem('@MySuperStore:token', (err, token) => {
      var message = {requestId:requestId};
      fetch('http://localhost:3000/api/friendreq', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
         'x-access-token': token
        },
        body: JSON.stringify(message)
      })
        .then((response) => {
          this.getFriendRequests();
          console.log(response)
        })
          .catch((error) => {
            console.warn("fetch error:", error)
          });
    });
  }




  render() {
    
    return (
      <View style={styles.background}>
      <RequestList requestList={ this.state.pendingRequests } acceptFriend={this.acceptFriendRequest.bind(this)} navigator={this.props.navigator} />
      <FriendList friendList={ this.state.friendList } navigator={this.props.navigator} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    alignItems: 'center'
  },
});


