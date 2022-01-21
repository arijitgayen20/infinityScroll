/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  Image,
  View,
  LogBox,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';

function App() {
  LogBox.ignoreAllLogs();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
  }

  const getData = () => {
    setLoading(true);
    axios('https://api.imgflip.com/get_memes')
      .then((response) => {
        if (response.data.success) {
          let arr = response.data.data.memes.map(function (el) {
            let o = Object.assign({}, el);
            const found = list.some(el => el.url === o.url);
            if (!found) {
              o.showQr = true;
            } else {
              o.showQr = false;
            }
            return o;
          })
          shuffle(arr);
          setList(pre => [...pre, ...arr]);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      })
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemView}>
        <View style={styles.imageView}>
          <Image source={{ uri: item.url }} style={styles.image} />
        </View>
        <View style={styles.nameView}>
          <Text>{item.name}</Text>
          <Text>{`${new Date().getHours()} : ${new Date().getMinutes()} : ${new Date().getSeconds()}`}</Text>
        </View>
        <View style={styles.qrcodeView}>
          {item.showQr && (
            <QRCode
              value={item.url}
              logoSize={20}
              logoBackgroundColor='transparent'
            />
          )}
        </View>
      </View>
    )
  }
  const separator = () => {
    return <View style={styles.separator} />
  }

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.container}>
        <FlatList
          data={list}
          renderItem={renderItem}
          ItemSeparatorComponent={separator}
          onEndReached={getData}
          keyExtractor={item => item.id.toString() + Math.random().toString()}
          ListFooterComponent={() => <View style={styles.loader}>{loading && (<ActivityIndicator color='#000' />)}</View>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  itemView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  separator: {
    width: '100%',
    height: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  imageView: {
    width: '30%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameView: {
    width: '30%',
    height: 200,
    justifyContent: 'center',
  },
  qrcodeView: {
    width: '30%',
    height: 200,
  },
  loader: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App;
