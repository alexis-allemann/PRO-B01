/**
 * @file    Search.tsx
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    04.03.2021
 * @brief   Search meeting page
 */

import * as React from 'react';
import { Platform, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import {
  Button,
  FAB,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import Globals from '../../../app/context/Globals';
import MeetingComponent from '../../../components/Meeting/MeetingComponent';
import styles from './styles';
import { Filter, Meeting, Tag } from '../../../app/models/ApplicationTypes';
import TagsComponent from '../../../components/Tags/TagsComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { addDays } from 'date-fns/esm';
import NoMeeting from '../../../components/NoMeeting/NoMeeting';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import { useStores } from '../../../app/stores/StoresContext';
import Strings from '../../../app/context/Strings';

const Search: React.FC = () => {
  // Usage of react native paper theme library
  const paperTheme = useTheme();

  /* Usage of MobX global state store */
  const { studentStore } = useStores();

  /* Component states */
  const [search, setSearch] = React.useState('');
  const [visible, setModalVisible] = React.useState(false);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [name, setName] = React.useState('');
  const [showStartDate, setShowStartDate] = React.useState(false);
  const [showEndDate, setShowEndDate] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(addDays(new Date(), 7));
  const [isLoading, setIsLoading] = React.useState(false);
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);
  const [searchWithId, setSearchWithId] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  /**
   * Action when start date is changed
   * @param selectedDate new date selected
   */
  const handleChangeStartDate = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setShowStartDate(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  /**
   * Action when end date is changed
   * @param selectedDate new date selected
   */
  const handleChangeEndDate = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate || endDate;
    setShowEndDate(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  /**
   * Search a meeting by id
   * @param id to search
   */
  const handleSearchWithId = (id: string) => {
    setIsLoading(true);
    setSearchWithId(true);
    setMeetings([]);
    setSearch(id);
    void studentStore.searchWithId(id).then(() => {
      setMeetings(studentStore.searchMeetings);
      setIsLoading(false);
    });
  };

  /**
   * Action when filter button is pressed
   */
  const handleSubmit = () => {
    setModalVisible(false);
    setIsLoading(true);
    setSearchWithId(false);
    setMeetings([]);
    const filter: Filter = {
      name: name !== '' ? name : null,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tags: tags.length === 0 ? [] : tags,
      location: null,
    };
    void studentStore.searchWithFilter(filter).then(() => {
      setMeetings(studentStore.searchMeetings);
      setIsLoading(false);
    });
  };

  /**
   * Add tag to filter
   * @param tag to add
   */
  const handleAddTag = (tag: Tag) => {
    tag.name = tag.name.toUpperCase();
    if (
      !tags.find((current: Tag) => {
        return current.name == tag.name;
      })
    )
      setTags([...tags, tag]);
  };

  /**
   * Remove tag from filter
   * @param tag to remove
   */
  const handleDeleteTag = (tag: Tag) => {
    const newTags = tags.filter((current: Tag) => {
      return current.name !== tag.name;
    });
    setTags(newTags);
  };

  /**
   * Action when meeting has changed
   */
  const handleChanged = () => {
    setIsLoading(true);
    if (searchWithId) handleSearchWithId(search);
    else handleSubmit();
    setIsLoading(false);
  };

  /**
   * Refresh action
   */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleSubmit();
    setRefreshing(false);
  }, []);

  /**
   * On component load
   */
  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      handleSubmit();
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[styles.container, { backgroundColor: paperTheme.colors.surface }]}>
          <View style={styles.search}>
            <TextInput
              label={Strings.SEARCH_ID}
              value={search}
              onChangeText={(id) => handleSearchWithId(id)}
              style={styles.fields}
            />
            <FAB
              style={styles.fab}
              small
              icon={Globals.ICONS.FILTER}
              onPress={() => setModalVisible(true)}
            />
          </View>
          {isLoading && (
            <View style={styles.container}>
              <LoadingComponent />
            </View>
          )}
          {!isLoading && meetings && meetings.length === 0 && <NoMeeting />}
          {!isLoading &&
            meetings &&
            meetings.length !== 0 &&
            meetings.map((meeting: Meeting) => (
              <MeetingComponent
                key={meeting.id}
                meeting={meeting}
                isSearchView={true}
                isChatable={true}
                isInCalendar={false}
                isChatView={false}
                onJoin={handleChanged}
                onLeave={handleChanged}
                onDelete={handleChanged}
              />
            ))}
          <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={[
                styles.modalcontainer,
                { backgroundColor: paperTheme.colors.surface },
              ]}>
              <View style={styles.modal}>
                <View style={styles.close}>
                  <IconButton
                    icon={Globals.ICONS.CLOSE_LOCATION}
                    size={Globals.SIZES.ICON_BUTTON}
                    color={Globals.COLORS.GRAY}
                    onPress={() => setModalVisible(false)}
                  />
                </View>
                <Title style={styles.title}>Filtres</Title>
                <View style={styles.content}>
                  <TextInput
                    label={Strings.MEETING_NAME}
                    defaultValue={name}
                    onChangeText={(id) => setName(id)}
                    style={styles.fields}
                  />
                  <View style={styles.dateHour}>
                    <Text style={{ color: Globals.COLORS.TEXT }}>
                      {Strings.MEETING_DATE_BETWEEN} :
                    </Text>
                  </View>
                  <View style={styles.date}>
                    <View style={styles.row}>
                      <Text style={{ color: Globals.COLORS.TEXT }}>
                        {format(new Date(startDate), 'dd.MM.yyyy')}
                      </Text>
                      <IconButton
                        icon={Globals.ICONS.CALENDAR}
                        size={Globals.SIZES.ICON_MENU}
                        color={Globals.COLORS.PRIMARY}
                        onPress={() => setShowStartDate(true)}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={{ color: Globals.COLORS.TEXT }}>
                        {format(new Date(endDate), 'dd.MM.yyyy')}
                      </Text>
                      <IconButton
                        icon={Globals.ICONS.CALENDAR}
                        size={Globals.SIZES.ICON_MENU}
                        color={Globals.COLORS.PRIMARY}
                        onPress={() => setShowEndDate(true)}
                      />
                    </View>
                  </View>
                  <View style={{ width: '100%' }}>
                    <TagsComponent
                      tags={tags}
                      addTag={(tag: Tag) => handleAddTag(tag)}
                      removeTag={(tag: Tag) => handleDeleteTag(tag)}
                    />
                  </View>
                </View>
                <Button
                  icon={Globals.ICONS.SEARCH}
                  mode="contained"
                  color={Globals.COLORS.PRIMARY}
                  labelStyle={{ color: Globals.COLORS.WHITE }}
                  onPress={handleSubmit}
                  style={styles.button}>
                  {Strings.SEARCH}
                </Button>
                <View>
                  {showStartDate && (
                    <DateTimePicker
                      value={startDate}
                      mode={'date'}
                      display="default"
                      onChange={(_event: Event, newDate: Date | undefined) =>
                        handleChangeStartDate(newDate)
                      }
                    />
                  )}
                </View>
                <View>
                  {showEndDate && (
                    <DateTimePicker
                      value={endDate}
                      mode={'date'}
                      display="default"
                      onChange={(_event: Event, newDate: Date | undefined) =>
                        handleChangeEndDate(newDate)
                      }
                    />
                  )}
                </View>
              </View>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(Search);
