import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
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

  const linedata = {
    labels: ['Now', 2023, 2024, 2025],
    datasets: [
      {
        data: [userBalance, userBalance*(1+(userAPY/100))**1, userBalance*(1+(userAPY/100))**2, userBalance*(1+(userAPY/100))**3],
      },
    ],
  };

  const test = 100.08848437984398894389438989438943894

  console.log(test, Number(test.toPrecision(2)), typeof(test))

  return (
    <>
    <View style={styles.container}>
    <View style={styles.row}>
        <Text style={styles.textTitle}> </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.textTitle}>June</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.square}>
          <Text style={styles.textHeading}>Balance</Text>
          <Text style={styles.textHeading}> </Text>
          <Text style={styles.textData}>${parseFloat(userBalance.toFixed(2))}</Text>
        </View>
        <View style={styles.square}>
            <Text style={styles.textHeading}>Total earnings</Text>
            <Text style={styles.textHeading}> </Text>
            <Text style={styles.textData}>${userInterest.toFixed(4)}</Text>
        </View>
        <View style={styles.square}>
            <Text style={styles.textHeading}>Current APY</Text>
            <Text style={styles.textHeading}> </Text>
            <Text style={styles.textData}>{userAPY.toFixed(2)}%</Text>
        </View>
      </View>
    </View>
    <View style={{alignItems: "center",
    justifyContent: "center",}}>
      <View style={styles.row}>
        <Text style={styles.textChartTitle}>3 year projection</Text>
      </View>
      <LineChart
      data={linedata}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      width={350}
      yAxisLabel="$"
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "ffffff",
        backgroundGradientTo: "#ffffff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 0) => `rgba(7, 193, 146, ${opacity})`,
        labelColor: (opacity = 100) => `rgba(7, 193, 146, ${opacity})`,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: "4",
          strokeWidth: "1",
          stroke: "##07c192"
        }
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  </View>
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.square}>
          <Button
            title="Deposit"
            color="#1035D6"
            onPress={depositOnPress}
          />
        </View>
        <View style={styles.square}>
          <Button
            title="Withdraw"
            color="#20C598"
            onPress={withdrawOnPress}
          />
        </View>
       </View>
     </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#1035D6",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  square: {
    borderColor: "#fff",
    borderWidth: 1,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  textChartTitle: {
    color: "#333333",
    fontSize: 12,
  },
  textHeading: {
    color: "#000",
    fontSize: 14,
  },
  textData: {
    color: "#1035D6",
    fontSize: 12,
    fontWeight: "bold",
  },
  textTitle: {
    color: "#1035D6",
    fontSize: 20,
    fontWeight: "bold",
  },
});
