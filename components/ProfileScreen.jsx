import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function ProfileScreen() {
  const {userProfileData} = useSelector((state) => state.profile)

  const renderItems = ({item}) => {
    console.log("renderItem -> ", item.email)
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.email}</Text>
      </View>
    )
  }
  console.log(userProfileData)
  return (
    <SafeAreaView>
      <FlatList
        data={[userProfileData]}
        renderItem={renderItems}
        keyExtractor={(item) => item.id.toString()}
        

      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  
  itemContainer: {
    backgroundColor:"red",
    padding: 10,
  },
  itemText: {
    fontSize: 18,
    color:"white",
    },
})