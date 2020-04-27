import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

interface ErrorMessageProps {
    message: string;
}

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

class ErrorMessage extends Component<ErrorMessageProps> {
    render() {
        const { message } = this.props;
        return <Text style={styles.errorMessage}>{message}</Text>;
    }
}

export { ErrorMessage };
