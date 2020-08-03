import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text } from 'react-native-elements';
import { faCalendarCheck } from '@fortawesome/pro-solid-svg-icons';

interface Props {
    totalTimesTracked: number;
}

class StreakTotalTimesTracked extends PureComponent<Props> {
    render(): JSX.Element {
        const { totalTimesTracked } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text>{totalTimesTracked}</Text>
                <FontAwesomeIcon icon={faCalendarCheck} />
            </View>
        );
    }
}

export { StreakTotalTimesTracked };
