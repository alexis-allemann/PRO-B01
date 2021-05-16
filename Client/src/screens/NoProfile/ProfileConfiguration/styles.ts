/**
 * @file    styles.ts
 * @author  Alexandre Mottier
 * @date    04.03.2021
 * @brief   Profile configuration page styles
 */

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: { marginTop: 20 },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 30,
    paddingTop: 20,
  },
  fields: {
    width: '100%',
  },
  image: {
    width: '100%',
    marginTop: -10,
    height: 200,
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 130,
    width: 100,
    height: 100,
    borderRadius: 200,
  },
});

export default styles;
