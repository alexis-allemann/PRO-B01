/**
 * @file    Meeting.tsx
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    08.04.2021
 * @brief   Meeting component
 */

import * as React from 'react';
import { Avatar, Card, Chip, IconButton, Paragraph, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';
import Globals from '../../app/context/Globals';
import { Alert, View } from 'react-native';
import { format } from 'date-fns';
import frenchLocale from 'date-fns/locale/fr';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Meeting, Tag } from '../../app/models/ApplicationTypes';
import { useNavigation } from '@react-navigation/core';
import { colors } from '../../app/context/Theme';
import Clipboard from 'expo-clipboard';
import LoadingComponent from '../Loading/LoadingComponent';
import { useStores } from '../../app/stores/StoresContext';
import Strings from '../../app/context/Strings';

/**
 * Component props
 */
interface IProps {
  meeting: Meeting;
  isChatable: boolean;
  isInCalendar: boolean;
  isSearchView: boolean;
  isChatView: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onDelete?: () => void;
}

const MeetingComponent: React.FC<IProps> = ({
  meeting,
  isChatable,
  isInCalendar,
  isSearchView,
  isChatView,
  onJoin,
  onLeave,
  onDelete,
}) => {
  /* Usage of React Navigation */
  const navigation = useNavigation();

  /* Usage of MobX global state store */
  const { studentStore, authenticationStore } = useStores();

  /* Component states */
  const [isReduced, setIsReduced] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  /* Local variables */
  let nbColors = 0;
  const isOwner = meeting.ownerID === authenticationStore.authenticatedStudent?.id;
  let isMemberOfMeeting =
    meeting.membersId.findIndex((current: string) => {
      return authenticationStore.authenticatedStudent?.id === current;
    }) !== -1;

  /**
   * Deploy or reduce meeting informations
   */
  const handleReduceOrDeploy = () => {
    isReduced ? setIsReduced(false) : setIsReduced(true);
  };

  /**
   * Action when the edit button is pressed
   */
  const handleEdit = () => {
    studentStore.setMeetingToUpdate(meeting);
    studentStore.setLocationToLoad(meeting.locationID);
    navigation.navigate(Globals.NAVIGATION.STUDENT_EDIT_MEETING);
  };

  /**
   * Join meeting action
   */
  const handleJoinMeeting = () => {
    setIsLoading(true);
    void studentStore.joinMeeting(meeting).then(() => {
      if (onJoin) onJoin();
      isMemberOfMeeting = true;
      setIsLoading(false);
    });
  };

  /**
   * Leave meeting action
   */
  const handleLeaveMeeting = () => {
    setIsLoading(true);
    void studentStore.leaveMeeting(meeting).then(() => {
      if (onLeave) onLeave();
      isMemberOfMeeting = false;
      setIsLoading(false);
    });
  };

  /**
   * Suppression de la réunion
   */
  const handleDelete = () => {
    Alert.alert(Strings.ASK_DELETE, Strings.ASK_MEETING_DELETE + meeting.name + ' ?', [
      {
        text: Strings.NO,
        style: 'cancel',
      },
      {
        text: Strings.YES,
        onPress: () => {
          void studentStore.deleteMeeting(meeting.id).then(() => {
            if (onDelete) onDelete();
          });
        },
      },
    ]);
  };

  /**
   * Copy meeting id to clipboard
   */
  const copyToClipboard = () => {
    Clipboard.setString(meeting.id);
    Alert.alert(Strings.SAVE, Strings.MEETING_ID_COPIED);
  };

  /**
   * Action on open chat button pressed
   */
  const handleOpenChat = () => {
    studentStore.setChatToLoad(meeting.chatID);
    studentStore.setMeetingToUpdate(meeting);
    navigation.navigate(Globals.NAVIGATION.STUDENT_CHAT);
  };

  return (
    <Card style={styles.card} elevation={10}>
      {isLoading && (
        <View style={styles.container}>
          <LoadingComponent />
        </View>
      )}
      {!isLoading && (
        <TouchableOpacity onPress={handleReduceOrDeploy}>
          <Card.Title
            title={meeting.name}
            subtitle={isReduced ? meeting.description : ''}
            left={() => <Avatar.Image size={40} source={require('../../../assets/HEIG-VD.png')} />}
            right={() =>
              (!isInCalendar || authenticationStore.authenticatedHost !== null) && (
                <View>
                  <View style={styles.nbPeople}>
                    <Text style={styles.gray}>
                      {meeting.membersId.length}/{meeting.maxPeople}
                    </Text>
                    <MaterialCommunityIcons
                      name={Globals.ICONS.PROFILE}
                      color={Globals.COLORS.GRAY}
                      size={Globals.SIZES.ICON_BUTTON}
                    />
                  </View>
                </View>
              )
            }
          />
        </TouchableOpacity>
      )}
      {!isLoading && !isReduced && (
        <Card.Content>
          <View style={styles.chips}>
            {meeting.tags.map((tag: Tag) => {
              return (
                <Chip
                  key={tag.name}
                  style={[styles.chip, { backgroundColor: colors[nbColors++ % colors.length] }]}>
                  {tag.name}
                </Chip>
              );
            })}
          </View>
          <View style={styles.infoWithIcon}>
            <MaterialCommunityIcons
              name={Globals.ICONS.ABC}
              color={Globals.COLORS.GRAY}
              size={Globals.SIZES.ICON_BUTTON}
              style={styles.icon}
            />
            <Paragraph style={[styles.paragraph, styles.gray]}>{meeting.description}</Paragraph>
          </View>
          <View style={styles.infoWithIcon}>
            <MaterialCommunityIcons
              name={Globals.ICONS.CALENDAR}
              color={Globals.COLORS.GRAY}
              size={Globals.SIZES.ICON_BUTTON}
              style={styles.icon}
            />
            <Text style={styles.gray}>
              {format(new Date(meeting.startDate), 'EEEE dd LLLL yyyy | HH:mm', {
                locale: frenchLocale,
              })}{' '}
              -{format(new Date(meeting.endDate), 'HH:mm', { locale: frenchLocale })}
            </Text>
          </View>
          <View style={styles.infoWithIcon}>
            <MaterialCommunityIcons
              name={Globals.ICONS.LOCATION}
              color={Globals.COLORS.GRAY}
              size={Globals.SIZES.ICON_BUTTON}
              style={styles.icon}
            />
            <Text style={styles.gray}>{meeting.locationName}</Text>
            <View style={styles.iconLittle}>
              {authenticationStore.authenticatedHost === null && (
                <MaterialCommunityIcons
                  name={Globals.ICONS.INFO}
                  color={Globals.COLORS.GRAY}
                  size={Globals.SIZES.ICON_HEADER}
                  onPress={() => {
                    void studentStore.setLocationToLoad(meeting.locationID);
                    navigation.navigate(Globals.NAVIGATION.STUDENT_LOCATION);
                  }}
                />
              )}
            </View>
          </View>
          <Card.Actions style={styles.actions}>
            {isChatable && authenticationStore.authenticatedHost === null && (
              <View>
                <IconButton
                  icon={Globals.ICONS.MESSAGE}
                  size={30}
                  color={Globals.COLORS.ORANGE}
                  onPress={handleOpenChat}
                />
                <Text style={[styles.gray, styles.buttonText]}>{Strings.CHAT}</Text>
              </View>
            )}
            {isOwner && !isChatView && (
              <View>
                <IconButton
                  icon={Globals.ICONS.COPY}
                  size={30}
                  onPress={copyToClipboard}
                  color={Globals.COLORS.GRAY}
                />
                <Text style={[styles.gray, styles.buttonText]}>{Strings.COPY_ID}</Text>
              </View>
            )}
            {!isMemberOfMeeting &&
              !isOwner &&
              !isInCalendar &&
              isSearchView &&
              meeting.maxPeople > meeting.membersId.length && (
                <View>
                  <IconButton
                    icon={Globals.ICONS.JOIN}
                    size={30}
                    onPress={handleJoinMeeting}
                    color={Globals.COLORS.GREEN}
                  />
                  <Text style={[styles.gray, styles.buttonText]}>{Strings.JOIN}</Text>
                </View>
              )}
            {isOwner && !isChatView && (
              <View>
                <IconButton
                  icon={Globals.ICONS.EDIT}
                  size={30}
                  onPress={handleEdit}
                  color={Globals.COLORS.BLUE}
                />
                <Text style={[styles.gray, styles.buttonText]}>{Strings.EDIT}</Text>
              </View>
            )}
            {isOwner && !isChatView && (
              <View>
                <IconButton
                  icon={Globals.ICONS.DELETE}
                  size={30}
                  onPress={handleDelete}
                  color={Globals.COLORS.PINK}
                />
                <Text style={[styles.gray, styles.buttonText]}>{Strings.DELETE}</Text>
              </View>
            )}
            {isMemberOfMeeting && !isOwner && (isInCalendar || isSearchView) && (
              <View>
                <IconButton
                  icon={Globals.ICONS.LEAVE}
                  size={30}
                  onPress={handleLeaveMeeting}
                  color={Globals.COLORS.PINK}
                />
                <Text style={[styles.gray, styles.buttonText]}>{Strings.LEAVE}</Text>
              </View>
            )}
          </Card.Actions>
          <IconButton
            icon={Globals.ICONS.ARROW_UP}
            size={20}
            onPress={handleReduceOrDeploy}
            color={Globals.COLORS.GRAY}
            style={styles.arrowUp}
          />
        </Card.Content>
      )}
    </Card>
  );
};

export default MeetingComponent;
