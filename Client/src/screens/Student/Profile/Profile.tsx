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
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import GlobalStore from '../../../app/stores/GlobalStore';
import { Meeting } from '../../../app/models/ApplicationTypes';
import NoMeeting from '../../../components/NoMeeting/NoMeeting';
import MeetingComponent from '../../../components/Meeting/MeetingComponent';

const Profile: React.FC = () => {
  /* Usage of MobX global state store */
  const store = React.useContext(GlobalStore);

  /* Component states */
  const [isLoading, setIsLoading] = React.useState(true);
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);

  /**
   * Action when component is loaded
   */
  React.useEffect(() => {
    setIsLoading(true);
    setMeetings(store.loadUserMeetings());
    setIsLoading(false);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.row}>
            <Avatar.Image size={80} source={require('../../../../assets/Logo.png')} />
            <Title style={styles.title}>{store.authenticatedUser?.name}</Title>
          </View>
          <Text style={styles.text}>Réunions que j&apos;ai crées :</Text>
          {isLoading && <LoadingComponent />}
          {!isLoading && meetings.length === 0 ? (
            <NoMeeting />
          ) : (
            meetings.map((meeting: Meeting) => (
              <MeetingComponent
                key={meeting.id}
                meeting={meeting}
                isOwner={true}
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
