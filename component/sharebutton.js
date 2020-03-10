import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity
} from "react-native";

import Share from 'react-native-share';

const {width, height} = Dimensions.get('window')
class ShareButtonComp extends PureComponent {
    onShare(){
        setTimeout(() => {
            Share.shareSingle(Object.assign(this.props.shareOptions, {
            "social": this.props.social
            }));
        },300);
        this.props.passProps()
    }
    
    render() {
        return (
            <TouchableOpacity style={styles.touchableStyle} onPress={()=>this.onShare()}>
                <Image source={{uri:this.props.logourl}} style={styles.imgiconModal}/>
                <Text style={styles.textIcon}>{this.props.name}</Text>
            </TouchableOpacity>
        );
    }
}
export default ShareButtonComp;

const styles = StyleSheet.create({
    touchableStyle : {marginTop:10, marginBottom:10, width:width*0.25},
    imgiconModal : { width:40, height:40, borderRadius:30, alignSelf:'center' },
    textIcon: {textAlign:'center'}
});
