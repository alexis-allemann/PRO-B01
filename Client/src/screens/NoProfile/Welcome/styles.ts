/**
 * @file    styles.ts
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    04.03.2021
 * @brief   Welcome page styles
 */

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 280,
    margin: 30,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    height: 250,
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 80,
    width: 80,
    height: 80,
    borderRadius: 200,
  },
  text: {
    textAlign: 'center',
  },
});

export default styles;
