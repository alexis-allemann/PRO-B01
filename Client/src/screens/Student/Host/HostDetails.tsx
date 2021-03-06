/**
 * @file    HostDetails.tsx
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    04.03.2021
 * @brief   Host details page
 */

import * as React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Avatar, Text, Title, Chip } from 'react-native-paper';
import styles from './styles';
import { observer } from 'mobx-react-lite';
import { Host, Tag } from '../../../app/models/ApplicationTypes';
import { colors } from '../../../app/context/Theme';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import { useStores } from '../../../app/stores/StoresContext';
import CovidDataDisplay from '../../../components/CovidDataDisplay/CovidDataDisplay';

const HostDetails: React.FC = () => {
  /* Usage of MobX global state store */
  const { studentStore } = useStores();

  /* Component states */
  const [isLoading, setIsLoading] = React.useState(true);
  const [host, setHost] = React.useState<Host | null>();
  const [refreshing, setRefreshing] = React.useState(false);

  /* Local variables */
  let nbColors = 0;

  /**
   * Action when component is loaded
   */
  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      setIsLoading(true);
      void studentStore.loadHost().then(() => {
        setHost(studentStore.hostToDisplay);
        setIsLoading(false);
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Refresh action
   */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    void studentStore.loadHost().then(() => {
      setHost(studentStore.hostToDisplay);
      setRefreshing(false);
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.room}>
                <Avatar.Image size={80} source={require('../../../../assets/HEIG-VD.png')} />
                <Title style={styles.title}>{host?.name}</Title>
              </View>
            </View>
            <View style={styles.container}>
              <Text style={styles.gray}>{host?.description}</Text>
              <View>
                <Text>
                  {host?.address.street} {host?.address.streetNb}, {host?.address.npa}{' '}
                  {host?.address.cityName}
                </Text>
              </View>
              <View style={styles.chips}>
                {host?.tags?.map((tag: Tag) => {
                  return (
                    <Chip
                      key={tag.name}
                      style={[
                        styles.chip,
                        { backgroundColor: colors[nbColors++ % colors.length] },
                      ]}>
                      {tag.name}
                    </Chip>
                  );
                })}
              </View>
              {host && <CovidDataDisplay host={host} editButtonDisplayed={false} />}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(HostDetails);
