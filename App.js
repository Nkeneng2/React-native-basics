// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// /**
//  * *on importe notre custom component search
//  */
import Search from "./Components/search";
import Details, {_shareFilm} from "./Components/FilmDetails";
import * as React from 'react';
import {View, Text, Button, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux'
import Store from "./Store/configureStore";
import Favoris from "./Components/Favoris";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const movieTabNavigator = createBottomTabNavigator();
const Stack = createStackNavigator();

//@TODO call the share function from the FilmDetail component
function search() {
    return (
        <Stack.Navigator
            initialRouteName="Feed"
            tabBarOptions={{
                activeTintColor: '#e91e63',
            }}>
            <Stack.Screen
                name="Home"
                component={Search}
            />
            <Stack.Screen
                name="Details"
                component={Details}
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            style={styles.share_touchable_headerrightbutton}
                            onPress={Details._shareFilm}
                        >
                            <Image
                                style={styles.share_image}
                                source={require('./images/ic_share.ios.png')}/>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack.Navigator>
    );
}

function favoris() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Favoris"
                component={Favoris}
            />
        </Stack.Navigator>
    )
}

function App() {
    // console.log(Details)
    return (
        <Provider store={Store}>
            <NavigationContainer>
                <movieTabNavigator.Navigator>
                    <movieTabNavigator.Screen name="Search" component={search} options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={size}/>
                        ),
                    }}/>
                    <movieTabNavigator.Screen name="Favoris" component={favoris} options={{
                        tabBarLabel: 'Favoris',
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name="heart" color={color} size={size}/>
                        ),
                    }}/>
                </movieTabNavigator.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

const styles = StyleSheet.create({
    share_touchable_headerrightbutton: {
        marginRight: 8
    },
    share_image: {
        width: 30,
        height: 50
    }
});
export default App;
