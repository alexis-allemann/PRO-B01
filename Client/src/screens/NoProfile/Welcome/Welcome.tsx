/**
 * @file    Welcome.tsx
 * @author  Alexis Allemann
 * @date    27.03.2021
 * @brief   Welcome page
 */

import * as React from 'react';
import { Image } from 'react-native';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import Globals from '../../../app/context/Globals';
import styles from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const Welcome: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Image
          source={require('../../../../assets/Classroom.jpg')}
          style={styles.image}
          resizeMode="cover"
          blurRadius={1}
        />
        <Image
          source={require('../../../../assets/Logo.png')}
          style={styles.logo}
          resizeMode="stretch"
        />
        <View style={styles.container}>
          <Title>Bienvenue sur Amphitryon</Title>
          <Text style={styles.text}>
            En vous conectant, vous acceptez nos conditions générales. Pour en savoir plus sur
            l&apos;usage que nous faisons de vos données, consultez notre politique de
            confidentialité et notre politique en matière de cookies.
          </Text>
          <Button
            icon={() => (
              <MaterialCommunityIcons
                name={Globals.ICONS.PROFILE}
                color={Globals.COLORS.WHITE}
                size={Globals.SIZES.ICON_HEADER}
                style={styles.icon}
              />
            )}
            mode="contained"
            style={styles.buttons}
            onPress={() => navigation.navigate('SignIn')}>
            Se connecter
          </Button>
          <Button
            icon={() => (
              <MaterialCommunityIcons
                name={Globals.ICONS.ADD_PROFILE}
                color={Globals.COLORS.WHITE}
                size={Globals.SIZES.ICON_HEADER}
                style={styles.icon}
              />
            )}
            mode="contained"
            style={styles.buttons}
            color={Globals.COLORS.BLUE}
            labelStyle={{ color: Globals.COLORS.WHITE }}
            onPress={() => navigation.navigate('SignUp')}>
            S&apos;inscrire
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;
