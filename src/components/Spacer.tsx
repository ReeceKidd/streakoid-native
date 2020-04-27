/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    spacer: {
        margin: 15,
    },
});

const Spacer = ({ children }: { children?: any }): JSX.Element => {
    return <View style={styles.spacer}>{children}</View>;
};

export { Spacer };
