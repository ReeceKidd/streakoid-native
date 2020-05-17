import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, FlatList, NavigationEvents } from 'react-navigation';

import { AppState } from '../../store';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/sharedActions';
import { Screens } from './Screens';
import { ListItem, Divider, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMedal } from '@fortawesome/pro-solid-svg-icons';
import { View, ActivityIndicator } from 'react-native';

const mapStateToProps = (state: AppState) => {
    const globalUserLeaderboard = state && state.leaderboards && state.leaderboards.globalUserLeaderboard;
    const getGlobalUserLeaderboardIsLoading =
        state && state.leaderboards && state.leaderboards.getGlobalUserLeaderboardIsLoading;
    const getGlobalUserLeaderboardErrorMessage =
        state && state.leaderboards && state.leaderboards.getGlobalUserLeaderboardErrorMessage;
    return {
        globalUserLeaderboard,
        getGlobalUserLeaderboardIsLoading,
        getGlobalUserLeaderboardErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getGlobalUserLeaderboard: bindActionCreators(leaderboardActions.getGlobalUserLeaderboard, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class GlobalUserLeaderboardScreenComponent extends PureComponent<Props> {
    renderGlobalUserLeaderboard(): JSX.Element {
        const { globalUserLeaderboard } = this.props;
        return (
            <FlatList
                data={globalUserLeaderboard}
                keyExtractor={(user) => user._id}
                renderItem={({ item, index }) => {
                    const { _id, username, profileImages, totalStreakCompletes } = item;
                    const userProfileImage = profileImages.originalImageUrl;
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.UserProfile, {
                                        _id,
                                        username,
                                    })
                                }
                            >
                                <ListItem
                                    leftElement={<Text>#{index + 1}</Text>}
                                    leftAvatar={{
                                        source: { uri: userProfileImage },
                                    }}
                                    title={username}
                                    subtitle={
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>{`Streak completes: `}</Text>
                                            <Text style={{ fontWeight: 'bold' }}>{`${totalStreakCompletes}`}</Text>
                                        </View>
                                    }
                                />
                            </TouchableOpacity>
                            <Divider />
                        </>
                    );
                }}
            />
        );
    }

    render(): JSX.Element | null {
        const { getGlobalUserLeaderboard, getGlobalUserLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        getGlobalUserLeaderboard({});
                    }}
                />
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Global User Leaderboard <FontAwesomeIcon icon={faMedal} />
                        </Text>
                        {getGlobalUserLeaderboardIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                    </View>
                    {this.renderGlobalUserLeaderboard()}
                </Spacer>
            </ScrollView>
        );
    }
}

const GlobalUserLeaderboardScreen = connect(mapStateToProps, mapDispatchToProps)(GlobalUserLeaderboardScreenComponent);
export { GlobalUserLeaderboardScreen };
