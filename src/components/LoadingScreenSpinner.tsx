import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import { Spacer } from './Spacer';

class LoadingScreenSpinner extends PureComponent {
    render() {
        return (
            <Spacer>
                <ActivityIndicator />
            </Spacer>
        );
    }
}

export { LoadingScreenSpinner };
