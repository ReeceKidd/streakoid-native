/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { Component } from 'react';
import { Card, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCrown } from '@fortawesome/pro-solid-svg-icons';

interface LongestStreakCardProps {
    longestStreak: number;
}

class LongestStreakCard extends Component<LongestStreakCardProps> {
    render(): JSX.Element {
        const { longestStreak } = this.props;
        return (
            <Card>
                <FontAwesomeIcon icon={faCrown} />
                <Text h4 style={{ textAlign: 'center' }}>
                    {longestStreak}
                </Text>
                <Text style={{ textAlign: 'center' }}>Longest streak</Text>
            </Card>
        );
    }
}

export { LongestStreakCard };
