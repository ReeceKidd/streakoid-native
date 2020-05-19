import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text } from 'react-native-elements';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';

interface Props {
    currentStreakNumberOfDaysInARow: number;
    negativeDayStreak: number;
}

class StreakFlame extends PureComponent<Props> {
    render(): JSX.Element {
        const { currentStreakNumberOfDaysInARow, negativeDayStreak } = this.props;
        return currentStreakNumberOfDaysInARow > 0 ? (
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>{currentStreakNumberOfDaysInARow}</Text>
                <FontAwesomeIcon icon={faFlame} style={{ color: 'red' }} />
            </View>
        ) : (
            <>
                {negativeDayStreak === 0 ? (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>{negativeDayStreak}</Text>
                        <FontAwesomeIcon icon={faFlame} style={{ color: 'gray' }} />
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>-{negativeDayStreak}</Text>
                        <FontAwesomeIcon icon={faFlame} style={{ color: 'blue' }} />
                    </View>
                )}
            </>
        );
    }
}

export { StreakFlame };
