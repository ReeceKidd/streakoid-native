import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Spacer } from './Spacer';

class LoadingScreenSpinner extends Component {
    render() {
        return (
            <Spacer>
                <ActivityIndicator />
            </Spacer>
        );
    }
}

export { LoadingScreenSpinner };
