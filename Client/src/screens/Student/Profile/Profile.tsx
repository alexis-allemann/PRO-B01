/**
 * @file    Profile.tsx
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    04.03.2021
 * @brief   Student profile page
 */

import * as React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Avatar, Text, Title } from 'react-native-paper';
import styles from './styles';
import { observer } from 'mobx-react-lite';
import { Meeting } from '../../../app/models/ApplicationTypes';
import NoMeeting from '../../../components/NoMeeting/NoMeeting';
import MeetingComponent from '../../../components/Meeting/MeetingComponent';
import { useStores } from '../../../app/context/storesContext';

const Profile: React.FC = () => {
  /* Usage of MobX global state store */
  const { studentStore, authenticationStore } = useStores();

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.row}>
            <Avatar.Image size={80} source={require('../../../../assets/Logo.png')} />
            <Title style={styles.title}>{authenticationStore.authenticatedUser?.username}</Title>
          </View>
          <Text style={styles.text}>Réunions que j&apos;ai crées :</Text>
          {studentStore.meetingsCreatedByUser && studentStore.meetingsCreatedByUser.length === 0 ? (
            <NoMeeting />
          ) : (
            studentStore.meetingsCreatedByUser.map((meeting: Meeting) => (
              <MeetingComponent
                key={meeting.id}
                meeting={meeting}
                isSearchView={false}
                isChatable={true}
                isInCalendar={false}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(Profile);
