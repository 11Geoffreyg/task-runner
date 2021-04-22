import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { findOne } from '../lib/user';
import { findOne as getTodos } from '../lib/todos'
import { ActivityIndicator, Colors } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
// Components
import { Todos, Map, UserInfos, Albums } from '../Components/Details/index'

const UserProvider = ({ children, id }) => {
  const [ user, setUser ] = useState(undefined)
  useEffect(() => {
    async function fetchData() {
      const res = await findOne(id)
      const todos = await getTodos(id)
      setUser({ ...res, todos })
    }
    fetchData()
  }, [])

  if (!user) return <ActivityIndicator animating={true} color={Colors.red800} />
  return children(user)
}

export default function DetailsScreen({ route, navigation }) {
  return (
    <UserProvider id={route.params.id}>
      {user => (
        <>
          <UserInfos user={user} />
          <Map />
          <Todos todos={user.todos} />
          <Albums userId={user.id} navigation={navigation} />
        </>
      )}
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  userCard: {
    boxShadow: '10px 10px 5px rgba(0, 0, 255, .5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    paddingBottom: 0,
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 255, .4)',
    margin: 20,
    borderRadius: 30,
  },

  userCardTitle: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
})