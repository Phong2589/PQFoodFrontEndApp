import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, RefreshControl, FlatList } from 'react-native';

import axios from 'axios';
import CurrencyFormat from 'react-currency-format';
import RenderItemOrder from '../components/RenderItemOrder';
import RenderStaff from '../components/RenderStaff';
import { LogBox } from 'react-native';
import styles from '../components/styles';
import { useIsFocused } from '@react-navigation/native'
import LoadingComponent from '../components/Loading';

function ChefCompleteFood(props) {

  const { navigation, route } = props;
  const [user, setUser] = useState('')
  const [name, setName] = useState('')
  const [order, SetOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused()

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  useEffect(() => {
    setUser(route.params.user);
    setName(route.params.name);
    setSocket(route.params.socket);
  }, [])

  const getOrder = () => {
    axios({
      method: 'get',
      url: '/waiter/getOrder',
      params: {
        table: route.params.slug
      }
    })
      .then(response => {
        SetOrder(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
  useEffect(() => {
    getOrder()
  }, [])

  useEffect(() => {
    getOrder()
  }, [isFocused])
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = () => {
    getOrder();
    setRefreshing(true);
    wait(1200).then(() => setRefreshing(false));
  };

  if (loading) {
    return (
      <LoadingComponent />
    )
  }
  else {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>{route.params.nameTable}</Text>

          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#ffcc66", "green", "blue"]}
              />
            }
            ListFooterComponent={
              <>
                <FlatList
                  data={order.staff}
                  ListHeaderComponent={<Text style={styles.ul}>Nhân viên xử lý</Text>}
                  renderItem={RenderStaff}
                  keyExtractor={(item) => item.id}
                  ListFooterComponent={
                    <TextInput
                      style={styles.noteStyle}
                      multiline
                      numberOfLines={4}
                      value={order.note}
                      editable={false}
                      selectTextOnFocus={false}
                    />
                  }
                />
              </>
            }
            ListHeaderComponent={
              <Text style={styles.ul}>Món gọi</Text>
            }
            data={order.order}
            renderItem={RenderItemOrder}
            keyExtractor={(item) => item.slug}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.footer2}>
            <Text style={styles.textBold}>Tổng Tiền: </Text>
            <CurrencyFormat
              value={order.total}
              displayType={'text'}
              thousandSeparator={true}
              suffix={' đ'}
              renderText={value => <Text style={styles.textBold}>{value}</Text>}
            />
          </View>
          <View style={styles.footerPage}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChefNotification', { nameTable: route.params.nameTable, slug: route.params.slug, user: user, name: name, socket: socket })
              }}
            >
              <Text style={[styles.textBold, styles.btnFooter]}>Thông báo</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{
              axios({
                method: 'get',
                url: '/chef/completeOrder',
                params: {
                  table: route.params.slug,
                  user: user
                }
              })
                .then(response => {
                  if (response.data === "ok") {
                    socket.emit("sendNotificationChefCompleteOrder", {
                      senderName: name,
                      table: route.params.nameTable,
                      act: 2
                    })
                    navigation.navigate('HomeChef')
                  }
                  else alert("Không thể hoàn thành hóa đơn")
                })
                .catch(error => {
                  console.log(error)
                })
            }}
            >
              <Text style={[styles.textBold, styles.btnFooter]}>Hoàn Thành</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>

    );
  }
}



export default ChefCompleteFood;
