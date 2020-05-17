import React, { PureComponent } from 'react';
import { Text } from 'react-native-elements';
import { Linking, Platform, View } from 'react-native';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';

interface MaximumNumberOfFreeStreaksMessageProps {
    totalLiveStreaks: number;
    isPayingMember: boolean;
}

class MaximumNumberOfFreeStreaksMessage extends PureComponent<MaximumNumberOfFreeStreaksMessageProps> {
    render() {
        const { totalLiveStreaks, isPayingMember } = this.props;
        const maximumNumberOfFreeStreaks = MAXIMUM_NUMBER_OF_FREE_STREAKS;
        const message = `You have used ${totalLiveStreaks} of your ${maximumNumberOfFreeStreaks} free streaks.`;
        if (!isPayingMember && Platform.OS === 'android') {
            return (
                <>
                    {totalLiveStreaks <= maximumNumberOfFreeStreaks ? (
                        <Text style={{ fontWeight: 'bold', color: 'green' }}>{message}</Text>
                    ) : (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={{ fontWeight: 'bold', color: 'red' }}>{message}</Text>
                            <Text
                                style={{ fontWeight: 'bold', color: 'blue', textDecorationLine: 'underline' }}
                                onPress={() => {
                                    Linking.openURL('https://streakoid.com/upgrade');
                                }}
                            >
                                Upgrade to unlock unlimited streaks.
                            </Text>
                        </View>
                    )}
                </>
            );
        }
        return null;
    }
}

export { MaximumNumberOfFreeStreaksMessage };
