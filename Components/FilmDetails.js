// Components/FilmDetails.js
import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    Share,
    ActivityIndicator,
    Platform,
    ScrollView,
    Button,
    TouchableOpacity
} from 'react-native'
import {getImageFromApi} from "../Api/TMDBAPI";
import {getfilmDetail} from "../Api/TMDBAPI";
import moment from 'moment'
import numeral from 'numeral'
import {connect} from 'react-redux'

class FilmDetails extends React.Component {

    constructor(props) {
        super(props);
        this.idFilm = this.props.route.params.idFilm;
        this.state = {
            film: undefined,
            isLoading: true,
        }
        // this._shareFilm = this._shareFilm.bind(this)
    }

    _shareFilm = async () => {
        try {
            const result = await Share.share({
                message:
                film.overview
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    _displayFloatingActionButton() {
        const {film} = this.state
        if (film !== undefined && Platform.OS === 'android') {
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={() => this._shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../images/ic_share.png')}/>
                </TouchableOpacity>
            )
        }
    }

    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
            // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex]
            })
            return
        }
        // Le film n'est pas dans nos favoris, on n'a pas son détail
        // On appelle l'API pour récupérer son détail
        this.setState({isLoading: true})
        getfilmDetail(this.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            })
        })
    }


    _displayFilm() {
        const film = this.state.film;
        if (film !== undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.image}
                        source={{uri: getImageFromApi(film.backdrop_path)}}
                    />
                    <Text style={styles.title_text}>{film.title}</Text>
                    <TouchableOpacity style={styles.favorite_container}
                                      onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.description_text}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sorti
                        le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note : {film.vote_average} / 10</Text>
                    <Text style={styles.default_text}>Nombre de votes : {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget
                        : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.default_text}>Genre(s) : {film.genres.map(function (genre) {
                        return genre.name;
                    }).join(" / ")}
                    </Text>
                    <Text style={styles.default_text}>Companie(s)
                        : {film.production_companies.map(function (company) {
                            return company.name;
                        }).join(" / ")}
                    </Text>
                </ScrollView>
            )
        }
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

    render() {
        // console.log(this.props);
        return (
            <View style={styles.main_container}>
                {this._displayFilm()}
                {this._displayLoading()}
                {this._displayFloatingActionButton()}
            </View>
        );
    }

    _toggleFavorite() {
        const action = {type: "TOGGLE_FAVORITE", value: this.state.film}
        this.props.dispatch(action);
    }

    componentDidUpdate() {
        console.log(this.props.favoritesFilm);
    }

    _displayFavoriteImage() {
        var sourceImage = require('../images/favorite_border.png')
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            sourceImage = require('../images/ic_favorite.png')
        }
        return (
            <Image
                source={sourceImage}
                style={styles.favorite_image}
            />
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },

    share_touchable_headerrightbutton: {
        marginRight: 5
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    favorite_container: {
        alignItems: 'center'

    },
    favorite_image: {
        width: 40,
        height: 40
    },
    share_image: {
        width: 30,
        height: 30
    }
});
const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
};
export default connect(mapStateToProps)(FilmDetails);

export const _shareFilm = async (state) => {
    try {
        const result = await Share.share({
            message:
                'test message'
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        alert(error.message);
    }
};

