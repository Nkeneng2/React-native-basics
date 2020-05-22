import React from 'react'
/**
 * *importation des elements natifs utilise dans notre custom component
 */
import {View, Button, TextInput, StyleSheet, FlatList, Text, ActivityIndicator} from 'react-native'
import {getFilmsFromApiWithSearchedText} from "../Api/TMDBAPI";
import FilmList from "./FilmList";
import Favoris from "./Favoris";
/**
 * *tous les components extends de React.Component
 */
class Search extends React.Component {
    /**
     *
     * @param props
     * @param navigation
     */
    constructor(props, navigation) {
        super(props, navigation);
        // * initialiser le texte recherche a vide
        // * lui il n'est pas dans le state car on ne veut pas rafraichir a chaque fois ke
        // * l'utilisateur saisi au clavier mais plutot apres kil ai saisi et clicke sur "rechercher "
        this.searchedText = "";
        this.page = 0;
        this.totalPage = 0;
        // * initialiser mon tableau de film a vide et le mettre dans le state
        // * pour rafraichir la vue a son chamgement
        this.state = {
            films: [],
            isLoading: false,
        };

        this._loadFilms= this._loadFilms.bind(this);

    }

    /**
     * * on passe la recherche de l'utilisateur a la fonction communiquant avec l'API
     * * et on actualise la vue pour afficher les resultats kon a affecte a notre variable " films"
     * @private
     */
    _loadFilms() {
        this.setState({isLoading: true});
        if (this.searchedText.length > 0) {
            getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then(data => {
                    this.page = data.page;
                    this.totalPage = data.totalPage;
                    this.setState({
                        // on concatene le tableau de nouveaux films avec celui deja recupere
                        films: [...this.state.films, ...data.results],
                        isLoading: false
                    })
                }
            )
        }
    }

    /**
     * * on recupere le texte saisi par l'utilisateur et recupere par le "onchangetext" et on l'affecte
     *  * a notre variable searchedtext
     */
    _searchTextInputChanged(text) {
        this.searchedText = text;
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                    {/* Le component ActivityIndicator possède une propriété size pour définir la taille du visuel de chargement : small ou large. Par défaut size vaut small, on met donc large pour que le chargement soit bien visible */}
                </View>
            );
        }
    }

    _searchFilms() {
        this.page = 0;
        this.totalPage = 0;
        // setstate est asynchrone c'est a dire elle laisse le programme continuer et s'execute en arriere plan
        // pour ne pas avoir les resultats de l'ancienne recherche dans la nouvelle
        // faudrait lancer la nouvelle recherche une fois que setstate se sera executee
        // et sa se fait grace au 2e parametre ki est une callback
        this.setState({
            films: []
        }, () => {
            this._loadFilms();
        })

    }

    render() {
        return (
            // ajouter les inlines styles au components
            <View style={styles.main_container}>
                {/*syntaxe pour inserer un style externalise a un component*/}
                <TextInput onSubmitEditing={() => this._searchFilms()}
                           onChangeText={(text) => this._searchTextInputChanged(text)}
                           style={styles.textinput} placeholder="Titre du film"/>
                {/*pour passer plusieurs styles on passe sous forme de tableau*/}
                {/*<TextInput style={[styles.textinput,styles.textinput1]} placeholder="Titre du film"/>*/}
                {/*<Button style={styles.button} title="Recherche"*/}
                {/*        onPress={() => this._searchFilms()}/>*/}
                <View style={styles.button}>
                    <Button
                        onPress={() => this._searchFilms()}
                        title="Recherche"
                        color="#ffff"
                    />
                </View>
                {/*on passe tous nos films recupere au component FilmList*/}
                <FilmList
                    films={this.state.films}
                    navigation={this.props.navigation}
                    loadFilms={this._loadFilms}
                    page={this.page}
                    totalPages={this.totalPages}
                />
                {/*alternative a la syntaxe du haut */}
                {/*<Button title="Recherche" onPress={function() {alert('hello world')}}/>*/}
                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    main_container: {
        marginTop: 20,
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#18ab29',
        width: "50%",
        margin: 10,
        backgroundColor: "#44c767"
    }
});

export default Search
