import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Button, Text } from 'react-native-elements';
import {
    FlatList,
    ScrollView,
    NavigationEvents,
    NavigationScreenProp,
    NavigationState,
    NavigationParams,
} from 'react-navigation';
import { Spacer } from '../components/Spacer';
import { AppState, AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { LoadingScreenSpinner } from '../components/LoadingScreenSpinner';
import { streakRecommendationActions } from '../actions/sharedActions';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { StreakRecommendationWithClientData } from '@streakoid/streakoid-shared/lib/reducers/streakRecommendationsReducer';
import { NavigationLink } from '../components/NavigationLink';
import { Screens } from './Screens';
import { ChallengeIcon } from '../components/ChallengeIcon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRobot, faCheck, faRocketLaunch } from '@fortawesome/pro-solid-svg-icons';

const mapStateToProps = (state: AppState) => {
    const streakRecommendations =
        state && state.streakRecommendations && state.streakRecommendations.streakRecommendations;
    const getStreakRecommendationsErrorMessage =
        state && state.streakRecommendations && state.streakRecommendations.getStreakRecommendationsErrorMessage;
    const getStreakRecommendationsIsLoading =
        state && state.streakRecommendations && state.streakRecommendations.getStreakRecommendationsIsLoading;
    return {
        streakRecommendations,
        getStreakRecommendationsErrorMessage,
        getStreakRecommendationsIsLoading,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getRandomStreakRecommendations: bindActionCreators(
        streakRecommendationActions.getRandomStreakRecommendations,
        dispatch,
    ),
    clearGetStreakRecommendationsErrorMessage: bindActionCreators(
        streakRecommendationActions.clearGetStreakRecommendationsErrorMessage,
        dispatch,
    ),
    selectStreakRecommendation: bindActionCreators(streakRecommendationActions.selectStreakRecommendation, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

class StreakRecommendationsScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Streak Recommendations',
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
            drawerIcon: () => <FontAwesomeIcon icon={faRobot} size={20} />,
        };
    };

    renderStreakSelectButton(streakRecommendation: StreakRecommendationWithClientData): JSX.Element {
        const { hasBeenSelected, _id } = streakRecommendation;
        const streakSelectButton = hasBeenSelected ? (
            <Button
                icon={<FontAwesomeIcon icon={faCheck} size={20} />}
                buttonStyle={{ backgroundColor: 'green' }}
                disabled
            />
        ) : (
            <Button
                onPress={() =>
                    this.props.selectStreakRecommendation({
                        challengeId: _id,
                    })
                }
                title="Select"
            />
        );
        return streakSelectButton;
    }
    render(): JSX.Element {
        const { getRandomStreakRecommendations, getStreakRecommendationsIsLoading, streakRecommendations } = this.props;
        return (
            <ScrollView style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => {
                        getRandomStreakRecommendations();
                    }}
                />
                <>
                    <Spacer>
                        <View style={{ alignItems: 'center' }}>
                            <Text>{`Oid uses artificial intelligence to recommend streaks for you`}</Text>
                        </View>
                    </Spacer>
                    <Spacer>
                        <Button
                            buttonStyle={{ backgroundColor: 'green' }}
                            icon={<FontAwesomeIcon icon={faRocketLaunch} color="white" size={20} />}
                            onPress={() => {
                                this.props.getRandomStreakRecommendations();
                            }}
                        />
                    </Spacer>
                    {getStreakRecommendationsIsLoading ? (
                        <LoadingScreenSpinner />
                    ) : (
                        <>
                            <Spacer>
                                <ScrollView>
                                    <FlatList
                                        data={streakRecommendations}
                                        keyExtractor={(streakRecommendation) => streakRecommendation._id}
                                        renderItem={({ item }) => {
                                            return (
                                                <ListItem
                                                    leftIcon={<ChallengeIcon icon={item.icon} color={item.color} />}
                                                    title={item.name}
                                                    rightElement={this.renderStreakSelectButton(item)}
                                                />
                                            );
                                        }}
                                    />
                                </ScrollView>
                            </Spacer>
                        </>
                    )}
                    <Spacer>
                        <View style={{ alignItems: 'center' }}>
                            <NavigationLink
                                text="Streaks are added to your Challenge streaks"
                                navigation={this.props.navigation}
                                screen={Screens.ChallengeStreaks}
                            />
                        </View>
                    </Spacer>
                    <View />
                </>
            </ScrollView>
        );
    }
}

const StreakRecommendationsScreen = connect(mapStateToProps, mapDispatchToProps)(StreakRecommendationsScreenComponent);

export { StreakRecommendationsScreen };
