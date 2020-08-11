import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text } from 'react-native-elements';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';

interface Props {
    numberOfDaysInARow: number;
}

class LongestCurrentStreakFlame extends PureComponent<Props> {
    render(): JSX.Element {
        const { numberOfDaysInARow } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text>{numberOfDaysInARow}</Text>
                <FontAwesomeIcon icon={faFlame} style={{ color: numberOfDaysInARow > 0 ? 'red' : 'grey' }} />
            </View>
        );
    }
}

export { LongestCurrentStreakFlame };
