import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://127.0.0.1:3000";

export default function App() {
  const [userBalance, setUserBalance] = useState(0);
  const [userInterest, setUserInterest] = useState(0);
  const [userAPY, setUserAPY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [outOfDate, setOutOfDate] = useState(false);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        setIsLoading(true);
        const response = await axios({
          method: 'put',
          url: baseUrl + '/userBalance',
          headers: {},
          data: {
            user: "0x1111111111",
            currency: "usd"
          }
        });

        if (response.status === 200) {
          console.log("yay");
          console.log(response.data.baseDepositBalance);
          setUserBalance(response.data.baseDepositBalance);
          setUserInterest(response.data.accruedBalance);
          setUserAPY(response.data.apy);
          console.log(response.data);
          setIsLoading(false);
          setOutOfDate(false);
        } else {
          throw new Error("Failed to fetch user balance");
        }
      } catch (error) {
        throw new Error("Failed axios call", error);
      }
    }

    fetchUserBalance();
  }, [userBalance, userInterest, userAPY, outOfDate]);

  const depositOnPress = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: baseUrl + '/curve/depositRequest',
        headers: {},
        data: {
          user: "0x1111111111",
          requestedDeposit: 100,
          currency: "usd"
        }
      });

      if (response.status === 200) {
        setOutOfDate(false);
      } else {
        throw new Error("Failed to fetch user balance");
      }
    } catch (error) {
      throw new Error("Failed axios call", error);
    }
    setOutOfDate(true);
  };

  const withdrawOnPress = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'post',
        url: baseUrl + '/curve/withdrawRequest',
        headers: {},
        data: {
          user: "0x1111111111",
          requestedWithdrawal: 100,
          currency: "usd"
        }
      });

      if (response.status === 200) {
        console.log("yay2");
        console.log(response.data);
        setOutOfDate(false);
      } else {
        throw new Error("Failed to fetch user balance");
      }
    } catch (error) {
      throw new Error("Failed axios call", error);
    }
    setOutOfDate(true);
  };

    if(!isLoading) {
      return (
        <>
          <Text>User Balance: {userBalance}</Text>
          <Text>User Interest: {userInterest}</Text>
          <Text>User APY: {userAPY}</Text>
          <Button
            title="Deposit"
            color="#f194ff"
            onPress={depositOnPress}
          />
          <Button
            title="Withdraw"
            color="#f194ff"
            onPress={withdrawOnPress}
          />
        </>
      );
    } else {
      return (<View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
