import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, ScrollView, Alert, ToastAndroid, AlertIOS, TouchableOpacity, FlatList, Animated, StatusBar, Modal, TouchableHighlight, CameraRoll, PermissionsAndroid, Clipboard} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ViewShot from "react-native-view-shot";
import ShareButtonComp from './component/sharebutton';
import ShareButtonCompLinking from './component/sharebuttonlinking'

const tags = [
  {id:1, name:'lorem'},
  {id:2, name:'ipsum'},
  {id:3, name:'dolor'}
]

const title = "What's the best sample text for this article lorem ipsum?"

const text = `What is Lorem Ipsum?\n
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
\n
Where does it come from?\n
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const {width, height} = Dimensions.get('window')
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ),
      refreshing: false,
      modalVisible: false,
      ssresult:''
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  scrollToTop = () => {
    this.scroller.scrollTo({x: 0, y: 0});
  };

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        CameraRoll.saveToCameraRoll(this.state.ssresult).then(function(result) {
          console.log('save succeeded ' + result);
          Alert.alert('Saved', 'Successfully saved the screenshot');
          this.handleCloseModal
        }).catch(function(error) {
          console.log('save failed ' + error);
          Alert.alert('Error', 'Ther are some error');
          this.handleCloseModal
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  onCapture() {
    this.refs.viewShot.capture().then(uri => { 
      this.setState({ssresult:uri})
      const file_path = uri;
      this.requestCameraPermission()
    });
    /* this.handleCloseModal() */
  }
  
  _renderScrollViewContent() {
    const data = Array.from({ length: 30 });
    return (
      <View style={styles.scrollViewContent}>
        {data.map((_, i) => (
          <View key={i} style={styles.row}>
            <Text>{i}</Text>
          </View>
        ))}
      </View>
    );
  }

  handleCloseModal = () => {
    console.log('Close Modal')
    this.setState({ modalVisible: false });
  }

  setModalVisible() {
    this.myRef.getNode().scrollTo({
      y: 0,
      animated: true,
    });
    this.setState({modalVisible: true});
  }

  render() {

    let shareOptions = {
      title: "React Native",
      message: "Hola",
      url: "http://url.me/",
      subject: "Share Link" //  for email
    };

    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
    const headerTrans = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });

    const titleOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    const imageTrans = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    return (
      <ViewShot style={styles.fill} ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
          <StatusBar translucent barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.251)"/>
          <Animated.ScrollView style={styles.fill} scrollEventThrottle={1} onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                    { useNativeDriver: true },
            )}
            contentInset={{
              top: HEADER_MAX_HEIGHT,
            }}
            contentOffset={{
              y: -HEADER_MAX_HEIGHT,
            }}
            ref={c => (this.myRef = c)}
          >
          <View style={styles.scrollViewContent}>
            <Text style={styles.textTitle}>
              {title}
            </Text>
            <View style={styles.viewProfile}>
              <Image source={{uri:'http://i.pravatar.cc/100'}} 
              style={styles.imgProfile}/>
              <View style={{marginLeft:10}}>
                <Text style={{fontWeight:'bold'}}>John Doe</Text>
                <Text>5 Mins Ago</Text>
              </View>

              <View style={styles.viewFollow}>
                <TouchableOpacity style={styles.btnFollow}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
                <FlatList
                contentContainerStyle={styles.listContainer}
                data={tags}
                horizontal={false}
                numColumns={3}
                keyExtractor= {(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity style={styles.tagsList}>
                        <Text style={styles.tagsText}> 
                          <Text style={styles.tagsHashtag}># </Text> 
                          {item.name}</Text>
                    </TouchableOpacity>
                  )
                }}/>
              </View>

              <View>
                <Text style={styles.textStyle}>
                  {text}
                </Text>
              </View>

              <View style={styles.viewShareStyle}>
                  <TouchableOpacity style={{marginRight:100, flexDirection:'row', height:50}}>
                      <FontAwesome name="heart-o" color="#FD5C63" size={20} style={{alignSelf:'center'}}> </FontAwesome>
                      <Text style={styles.textShare}> 451</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: 'center', flexDirection:'row'}}>
                      <MaterialCommunityIcons name="comment-text-outline" size={20} color="#FD5C63"  style={{alignSelf:'center'}}> </MaterialCommunityIcons>
                      <Text style={styles.textShare}> 172</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft:100, flexDirection:'row'}}
                  onPress={() => {
                  this.setModalVisible(true);
                  }}>
                      <SimpleLineIcons name="share-alt" type="SimpleLineIcons" color="#FD5C63"  style={{alignSelf:'center'}}></SimpleLineIcons>
                      <Text style={styles.textShare}> 109</Text>
                  </TouchableOpacity>
              </View>
            <View>

            </View>
          </View>
          </Animated.ScrollView>
          {/**************************************** PARALLAX SECTION START *******************************************************************/}
          <Animated.View pointerEvents="none" style={[styles.header,{ transform: [{ translateY: headerTrans }] },]}>
            <Animated.Image style={[ styles.backgroundImage, {opacity: imageOpacity,transform: [{ translateY: imageTrans }]}]} source={{uri:'https://source.unsplash.com/collection/190727/1600x900'}} />
            <SimpleLineIcons name="arrow-left-circle" size={25} color="#FC6C73" style={styles.headerClose}/>
          </Animated.View>
          <Animated.View
          style={[styles.bar,{ transform: [ { scale: titleScale }, { translateY: titleOpacity },],},{opacity: titleOpacity},{flexDirection:'row'}]}
          >
            <SimpleLineIcons name="arrow-left-circle" size={25} color="#FC6C73" style={{flex:1,alignSelf:'flex-start', zIndex:1}}/>
            <Text numberOfLines={2} style={[styles.title, {width:width*0.85}]}>{title}</Text>
          </Animated.View>

          {/**************************************** PARALLAX SECTION END *******************************************************************/}
          
          {/**************************************** MODAL SECTION START *******************************************************************/}
          <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}>
            <TouchableOpacity style={styles.modalOutside} onPressOut={this.handleCloseModal}>
              <View style ={styles.modalInside}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalSubContent}>
                      <ShareButtonComp shareOptions={shareOptions} social={'facebook'} logourl={'https://logo.clearbit.com/facebook.com'} name={'Facebook'} passProps={this.handleCloseModal}/>
                      <ShareButtonCompLinking url={'line://msg/text/?{TEST MESSAGE}'} logourl={'https://logo.clearbit.com/line.me'} name={'LINE'} passProps={this.handleCloseModal}/>
                      <ShareButtonComp shareOptions={shareOptions} social={'instagram'} logourl={'https://logo.clearbit.com/instagram.com'} name={'Instagram'} passProps={this.handleCloseModal}/>
                      <ShareButtonComp shareOptions={shareOptions} social={'twitter'} logourl={'https://logo.clearbit.com/twitter.com'} name={'Twitter'} passProps={this.handleCloseModal}/>
                    </View>
                    <View style={styles.modalSubContent}>
                      <TouchableOpacity style={styles.touchableShare} onPress={()=>this.onCapture()}>
                        <MaterialCommunityIcons name="folder-image" size={40} style={styles.imgiconModal}/>
                        <Text style={{textAlign:'center'}}>Screenshot</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.touchableShare} onPress={()=>{
                        setTimeout(() => {
                          if(typeof shareOptions["http://test.me"] !== undefined) {
                            Clipboard.setString(shareOptions["http://test.me"]);
                            if (Platform.OS === "android") {
                              ToastAndroid.show('Link copied', ToastAndroid.SHORT);
                            } else if (Platform.OS === "ios") {
                              AlertIOS.alert('Link copied');
                            }
                          }
                        },300);
                      }}>
                        <AntDesign name="link" size={40} style={styles.imgiconModal}/>
                        <Text style={{textAlign:'center'}}>Share Link</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.touchableShare} onPress={()=>alert('Show more options')}>
                        <MaterialCommunityIcons name="more" size={40} style={styles.imgiconModal}/>
                        <Text style={{textAlign:'center'}}>More</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                <TouchableOpacity
                  style={{backgroundColor: '#ffffff', width: width, height: 40, paddingBottom:20}}
                  onPress={this.handleCloseModal}
                >
                  <Text style={{textAlign:'center', fontSize:20, paddingBottom:10}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity >
          </Modal>
          {/**************************************** MODAL SECTION END *******************************************************************/}
      </ViewShot>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    /* flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column', */
  },
  listContainer:{
    marginLeft:20,
    alignItems:'flex-start'
  },

  fill: {
    flex: 1,
    backgroundColor:'#fff'
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
    display: 'none',
  },
  backgroundImage: {
    top: 0,
    right: 0,
    left: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
    position: 'absolute',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 28 : 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: '#000',
    fontSize: 18,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfile: {flex: 1, flexDirection:'row', marginTop:10, borderBottomColor:'#ccc', borderBottomWidth:1, paddingBottom:10},
  imgProfile: {width:40, height:40, alignSelf:'flex-start', borderRadius:40, marginLeft:10},
  viewFollow: {flex:1, justifyContent:'center', marginRight:10},
  btnFollow: {alignSelf: 'flex-end', borderWidth:2, borderColor:'#FC6C73', borderRadius:10},
  followText: {padding:5, color:'#FC6C73'},

  tagsList: {borderRadius:10, marginLeft:5, marginRight:5, marginTop:10, backgroundColor:'#F0F0F0'},
  tagsText: {flex:1, justifyContent:'center', alignSelf:'center', padding:5, fontWeight:'500'},
  tagsHashtag : {color:'#FC6B72', fontWeight:'500', fontSize:15},

  textTitle: {marginLeft:20, marginRight:20, marginTop:10, marginBottom:10, fontSize:18, fontWeight:'400'},
  textStyle:{marginLeft:20, marginRight:20, marginTop:20, letterSpacing:1, fontSize:15},
  viewShareStyle: {flex:1, marginTop:20, flexDirection:'row', justifyContent:'center', borderTopColor:'#EAEAEA', borderTopWidth:1},
  textShare: {textAlignVertical:'center', color:'#FD5C63', fontSize:15},

  swiperText:{flex:1, alignSelf:'center', zIndex:1, position:"absolute", textAlign:'center', fontSize:20, color:'#fff', marginTop:30, fontWeight:'bold'},
  headerClose:{flex:1,alignSelf:'flex-start', zIndex:1, marginLeft:10, marginTop:30},

  modalOutside: {flex: 1,backgroundColor: 'rgba(0,0,0,0.2)', flexDirection:'row'},
  modalInside: {flex:1, alignItems: 'center', justifyContent: 'center', alignContent:'flex-end', alignSelf:'flex-end'},
  modalContent: {backgroundColor: '#ffffff', width: width, height: 180, borderTopLeftRadius:20, borderTopRightRadius:20},
  modalSubContent: {flexDirection:'row', borderBottomColor:'#ccc', borderBottomWidth:1},
  imgiconModal : { width:50, height:50, borderRadius:30, alignSelf:'center' },

  touchableShare: {marginTop:10, marginBottom:10, width:width*0.33}

});