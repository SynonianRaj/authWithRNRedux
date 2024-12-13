import { useState, useEffect } from 'react';
import {
  Button,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

export default function DocListScreen({navigation}) {
  const [loading, setLoading] = useState(true);
  const [docList, setDocList] = useState([]);

  const url = "https://dummyjson.com/users/";

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await axios.get(url);
        if (res.status === 200) {
          setDocList(res.data.users); // Adjusted to access the correct data structure
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const renderItems = ({ item }) => {
    return (
      <TouchableOpacity style={styles.listItem} onPress={() => {navigation.navigate("chat",{'user':item})}}>
        <Text style={styles.listItemText}>{item.firstName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <FlatList
          data={docList}
          renderItem={renderItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor:"red",
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItemText: {
    fontSize: 18,
    color: '#333',
  },
});