import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    Linking
} from "react-native";
const {width, height} = Dimensions.get('window')
class ShareButtonCompLinking extends Component {
    openUrl(){
        Linking.openURL(this.props.url).catch((err) => console.error('An error occurred', err))
        this.props.passProps()
    }
    render() {
        return (
        <TouchableOpacity style={{marginTop:10, marginBottom:10, width: width*0.25}} onPress={() => this.openUrl() }>
                <Image source={{uri:this.props.logourl}} style={styles.imgiconModal}/>
                <Text style={{textAlign:"center"}}>{this.props.name}</Text>
        </TouchableOpacity>
        );
    }
}
export default ShareButtonCompLinking;

const styles = StyleSheet.create({
    imgiconModal : { width:40, height:40, borderRadius:30, alignSelf:'center' },
});