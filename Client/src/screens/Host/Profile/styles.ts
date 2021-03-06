/**
 * @file    styles.ts
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    29.04.2021
 * @brief   Host profile page styles
 */

import { StyleSheet } from 'react-native';
import Globals from '../../../app/context/Globals';

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    width: '100%',
  },
  cardTitle: {
    color: Globals.COLORS.TEXT,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -10,
  },
  chip: {
    width: 'auto',
    margin: 5,
  },
  chips: {
    marginLeft: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  gray: {
    color: Globals.COLORS.TEXT,
  },
  icon: {
    marginRight: 10,
  },
  infoWithIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  paragraph: {
    maxWidth: '80%',
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    color: Globals.COLORS.TEXT,
    marginLeft: 20,
    fontSize: 25,
  },
});

export default styles;
