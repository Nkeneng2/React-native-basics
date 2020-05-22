// Components/Favorites.js

import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import FilmList from './FilmList'
import {connect} from 'react-redux'

class Favoris extends React.Component {

    render() {
        // console.log(FilmList)
        return (
            // <View style={styles.main_container}>
                <FilmList
                    films={this.props.favoritesFilm}
                    navigation={this.props.navigation}
                    favoriteList={true} // Ici on est bien dans le cas de la liste des films favoris. Ce booléen à true permettra d'empêcher de lancer la recherche de plus de films après un scroll lorsqu'on est sur la vue Favoris.
                />
            // </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        marginTop: 20,
        flex: 1
    },
})

const mapStateToProps = state => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(Favoris)