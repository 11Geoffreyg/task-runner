import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';


export default function Map({users}) {
  console.log(users)
  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        { users.map(user => (
          <Marker
          key= {user.id}
          coordinate={{ 
          latitude: user.address.geo.lat,
          longitude: user.address.geo.lng,
          }}
          image={require('../assets/marker.png')}
          title= {user.name}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width-20,
    height: (Dimensions.get('window').height)/3,
    marginLeft: 10,
    marginRight: 10
  },
})