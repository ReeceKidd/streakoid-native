import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Text, ListItem } from 'react-native-elements';

import { LongestEverStreakFlame } from './LongestEverStreakFlame';
import { StreakFlame } from './StreakFlame';
import { StreakTotalTimesTracked } from './StreakTotalTimesTracked';

interface Props {
    index: number;
    userProfileImage: string;
    streakName: string;
    longestStreakNumberOfDaysInARow: number;
    negativeDayStreak: number;
    currentStreakNumberOfDaysInARow: number;
    totalTimesTracked: number;
}

class IndividualStreakLeaderboardItem extends PureComponent<Props> {
    render(): JSX.Element {
        const {
            index,
            userProfileImage,
            streakName,
            longestStreakNumberOfDaysInARow,
            negativeDayStreak,
            currentStreakNumberOfDaysInARow,
            totalTimesTracked,
        } = this.props;
        return (
            <ListItem
                leftElement={<Text>#{index + 1}</Text>}
                leftAvatar={{
                    source: { uri: userProfileImage },
                }}
                title={streakName}
                subtitle={
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <LongestEverStreakFlame numberOfDaysInARow={longestStreakNumberOfDaysInARow} />
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            <StreakFlame
                                negativeDayStreak={negativeDayStreak}
                                currentStreakNumberOfDaysInARow={currentStreakNumberOfDaysInARow}
                            />
                        </View>

                        <View style={{ marginLeft: 5 }}>
                            <StreakTotalTimesTracked totalTimesTracked={totalTimesTracked} />
                        </View>
                    </View>
                }
            />
        );
    }
}

export { IndividualStreakLeaderboardItem };
