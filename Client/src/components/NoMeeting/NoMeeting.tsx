/**
 * @file    NoMeeting.tsx
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    08.04.2021
 * @brief   No meeting component
 */

import * as React from 'react';
import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Globals from '../../app/context/Globals';
import { View } from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Strings from '../../app/context/Strings';

const NoMeeting: React.FC = () => {
  /* Usage of React Navigation */
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.row}>
        <MaterialCommunityIcons name={Globals.ICONS.SAD} color={Globals.COLORS.GRAY} size={50} />
        <Text style={styles.text}>{Strings.MEETING_NONE}</Text>
      </View>
      <Button
        icon={Globals.ICONS.CREATE}
        mode="contained"
        color={Globals.COLORS.PRIMARY}
        labelStyle={{ color: Globals.COLORS.WHITE }}
        onPress={() => {
          navigation.navigate(Globals.NAVIGATION.STUDENT_CREATE_MEETING);
        }}>
        {Strings.MEETING_CREATE}
      </Button>
    </View>
  );
};

export default NoMeeting;
