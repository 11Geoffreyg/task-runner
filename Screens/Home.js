import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { find } from '../lib/user'
import { ActivityIndicator, Colors } from 'react-native-paper';
import { Avatar, Card } from 'react-native-paper';

function UserProvider ({ children }) {
  const [ users, setUsers ] = useState(null)
  useEffect(() => {
    async function fetchData() {
      const res = await find()
      setUsers(res)
      console.log(res)
    }
    fetchData()
  }, [])

  if (!users) return <ActivityIndicator animating={true} color={Colors.red800} />
  return children(users)
}

function SearchbarProvider ({ children, users }) {
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ displayedUsers, setDisplayedUsers ] = useState(users)

  const onChangeSearch = value => {
    const newValue = value.toLowerCase()
    const matchingUsers = users.filter(user => user.name.toLowerCase().includes(newValue))
    setSearchQuery(newValue)
    setDisplayedUsers(matchingUsers)
  }
  
  return (
    <>
      <Searchbar
        placeholder="Chercher un utilisateur"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.Searchbar}
      />
      {children(displayedUsers)}
    </>
  )
}

const PaginationProvider = ({ children, users }) => {
  // display first 5 users
  const [ paginatedUsers, setPaginatedUsers ] = useState(users.filter((user, i) => i < 5))
  // set number of pages
  const [ pages, setPages ] = useState(undefined)

  useEffect(() => {
    // set number of pages in an array / ex: [ 1, 2 ] for 2 pages
    let p = []
    for (let i = 1; i <= Math.floor(users.length / 5); i++) p.push(i)
    setPages(p)
    setPaginatedUsers(users.filter((user, i) => i < 5))
  }, [ users ])

  function handlePageChange (page) {
    let displayedUsers = []
    for(let i = 5*(page-1); i < 5*(page-1)+5; i++) displayedUsers.push(users[i])
    setPaginatedUsers(displayedUsers)
  }

  return (
    <>
      {children(paginatedUsers)}
      <View style={ styles.paginationContainer }>
        {pages && pages.length > 0 && pages.map(i => (
          <Text
            key={i}
            style={ styles.pagination }
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Text>))}
      </View>
    </>
  )
}

const UserListWithSearchAndPagination = ({ navigation }) => (
  // FAAC Bitch 👌
  <UserProvider>
    {users => (
      <>
      <SearchbarProvider users={users} >
        {matchingUsers => (
          <PaginationProvider users={matchingUsers}>
            {paginatedUsers => (
              <>
                {paginatedUsers.map((user, i) => (
                  <Card key={i} onPress={() => navigation.navigate('Details', { id: user.id })}>
                    <Card.Title
                      title={user.name}
                      titleStyle={ styles.userCardTitle }
                      left={(props) => <Avatar.Text {...props} label={user.initials} size= {50} />}
                      style={ styles.userCard }
                    />
                  </Card>)
                )}
              </>
            )}
          </PaginationProvider>
        )}
      </SearchbarProvider>
      <Map users={users}/>
      </>
    )}
  </UserProvider>
)

function HomeScreen({ navigation }) {
  useEffect(() => navigation.navigate('Details', {id: 1}))
  return (
    <View>
      <UserListWithSearchAndPagination navigation={navigation} />
    </View>
  );
}


const styles = StyleSheet.create({
  
  paginationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },

  pagination: {
    backgroundColor: 'white',
    width: '50%',
    height: '100%',
    textAlign: 'center',
    color: 'rgba(0, 0, 255, 0.6)',
    fontSize: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

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

  Searchbar: {
    height: 55,
  },

});

export default HomeScreen
