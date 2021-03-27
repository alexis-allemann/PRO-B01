/**
 * @file    Search.tsx
 * @author  Alexis Allemann
 * @date    09.02.2021
 * @brief   Student search page
 */

import * as React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Title } from 'react-native-paper';

const Search: React.FC = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Title>Search</Title>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
