import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView, SafeAreaView, Button } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Constants from 'expo-constants';

import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';



function WaiterAddOrder(props) {

  const { navigation, route } = props;
  const [food, setFood] = useState(null)
  const [drink, setDrink] = useState(null)
  const [total, setTotal] = useState(0)


  const [selectedId, setSelectedId] = useState(null);

  const getmenu = () => {
    axios({
      method: 'get',
      url: '/waiter/getFood',
    })
      .then(response => {
        setFood(response.data.food)
        setDrink(response.data.drink)
      })
      .catch(error => {
        console.log(error)
      })
  }
  if (food === null || drink === null) getmenu()


  const renderItem = ({ item }) => {
    return (
      <SafeAreaView style={styles.item}>
        <View>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: item.image
            }}
          />
        </View>
        <View style={styles.infoItem}>
          <View style={styles.groupInfo}>
            <View><Text >{item.name}</Text></View>
            <View><Text >abc</Text></View>
          </View>
          <View style={styles.groupInfo}>
            <View><Text ></Text></View>
            <View><Text >abc</Text></View>
          </View>
          <View style={styles.groupInfo}>
            <View><Text >abc</Text></View>
            <View><Text >{item.price}</Text></View>
          </View>
        </View>

      </SafeAreaView>
    );
  };

  const setTotalFun = () => {
    setTotal(10800)
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{route.params.nameTable}</Text>

        <FlatList
          ListFooterComponent={
            <>
              <FlatList
                data={drink}
                ListHeaderComponent={<Text style={styles.ul}>Danh Sách Thức Uống</Text>}
                renderItem={renderItem}
                keyExtractor={(item) => item.slug}
              />   
            </>
          }
          ListHeaderComponent={
            <Text style={styles.ul}>Danh Sách Thức Ăn</Text>
          }
          data={food}
          renderItem={renderItem}
          keyExtractor={(item) => item.slug}
        />



      </View>
      <View style={styles.footer}>
        <View style={styles.footer2}>
          <Text style={styles.textBold}>Tổng Tiền: </Text>
          <Text style={styles.textBold}>{total}</Text>
        </View>
        <View>
          <TouchableOpacity style={{ backgroundColor: "#ffcc66", alignItems: "center", height: 40 }}
            onPress={setTotalFun}

          >
            <Text style={[styles.textBold, { lineHeight: 40 }]}>Lập hóa đơn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    color: "#ff6600",
    marginVertical: 6
  },
  ul: {
    fontSize: 18,
    color: "#ff6600",
    textAlign: "center"
  },
  tinyLogo: {
    width: 80,
    height: 80,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.9,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10
  },
  groupInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.6
  },
  footer: {
    height: windowHeight * 0.1,

    // flex: 2,
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  footer2: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 6,
    backgroundColor: "#ccffcc"
  }
  ,
  textBold: {
    fontWeight: "bold",
    fontSize: 20
  }
});

export default WaiterAddOrder;
