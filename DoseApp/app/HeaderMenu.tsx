import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


const HeaderWithMenu = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = async () => {
    // Handle logout logic
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      closeMenu();
      router.replace("./login");
    } catch (error) {
      Alert.alert('Error', 'Unable to logout.');
    }
  };

  return (
    <Appbar.Header style={styles.header}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="menu"
            color="#fff"
            onPress={openMenu}
          />
        }
      >
        <Menu.Item onPress={handleLogout} title="Logout" />
        <Menu.Item onPress={() => router.push("./About")} title="About" />
      </Menu>
      <Appbar.Content title="DoseBuddy" />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#008080', // Customize your header color
  },
  
});

 export default HeaderWithMenu;

// import React, { useState } from 'react';
// import { View } from 'react-native';
// import { Appbar, Menu } from 'react-native-paper';

// export default function TestMenu() {
//   const [visible, setVisible] = useState(false);

//   return (
//     <Appbar.Header>
//       <Menu
//         visible={visible}
//         onDismiss={() => setVisible(false)}
//         anchor={<Appbar.Action icon="menu" onPress={() => setVisible(true)} />}
//       >
//         <Menu.Item onPress={() => console.log('Option 1')} title="Option 1" />
//         <Menu.Item onPress={() => console.log('Option 2')} title="Option 2" />
//       </Menu>
//     </Appbar.Header>
//   );
// }
