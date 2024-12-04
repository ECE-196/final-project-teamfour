import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function About() {
  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.text}>
          Thank you for choosing DoseBuddy, your ultimate smart pill dispenser! 
        </Text>

        <Image 
              source={require('../assets/images/pill_happy.png')} // Replace with your image path
              style={styles.image}
            />
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          Meet the brains (and hearts!) behind DoseBuddy—three founders on a mission to make managing medication stress-free and accessible for everyone: 
        </Text>

        <Text style={styles.text}>
          <Text style = {styles.bold}>Anupama </Text>, the app wizard of the team, Anu poured her heart and code into the DoseBuddy app. Thanks to her, you’ll never miss a dose again—your meds are just a tap away.
        </Text>

        <Text style={styles.text}>
        <Text style = {styles.bold}>Jessie </Text>, the creative mind behind DoseBuddy’s sleek and user-friendly enclosure, Jessie made sure it doesn’t just work well—it looks great on your counter too. Function meets fashion, all thanks to her!
        </Text>

        <Text style={styles.text}>
        <Text style = {styles.bold}>Théanie </Text>, the team’s in-house engineer, T designed and executed the precise gear dispensing mechanism that makes DoseBuddy tick.
        </Text>

        <Text style={styles.text}>
          Together, this trio has combined their skills to create a device that’s not just a pill dispenser but a game-changer for health and independence. With DoseBuddy, they’re making life easier—one dose at a time!
        </Text>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    backgroundColor: '#f1ece0',
  },
  section: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  image: {
    padding:5,
    width: 50, // Adjust size as needed
    height: 70,
    alignSelf: 'center',
  },
});
