import {
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    SafeAreaView,
    Image,

} from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserList } from '../redux/userRedux/action'





export default function UserList({ navigation }) {
    const dispatch = useDispatch();
    const { loading, users, error } = useSelector((state) => state.userReducer);
    const handleGoTOBtn = () => {
        navigation.navigate("UserDetails")
    }

    useEffect(() => {
        dispatch(getUserList());

    }, [])


    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.itemText}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.itemText}>{item.email}</Text>
                <Button title="Go to Details" onPress={handleGoTOBtn} />
            </View>
        );
    }


    console.log("data from userlist-> ", users)
    return (
        <SafeAreaView>
            {
                loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <FlatList
                        data={users}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                    />
                )
            }
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
    },

})