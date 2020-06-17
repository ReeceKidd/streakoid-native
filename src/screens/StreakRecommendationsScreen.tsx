import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Button, Text } from 'react-native-elements';

import { Spacer } from '../components/Spacer';
import { AppState, AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { LoadingScreenSpinner } from '../components/LoadingScreenSpinner';
import { streakRecommendationActions } from '../actions/authenticatedSharedActions';
import { StreakRecommendationWithClientData } from '@streakoid/streakoid-shared/lib/reducers/streakRecommendationsReducer';
import { NavigationLink } from '../components/NavigationLink';
import { Screens } from './Screens';
import { ChallengeIcon } from '../components/ChallengeIcon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faRocketLaunch } from '@fortawesome/pro-solid-svg-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { ScrollView, FlatList } from 'react-native-gesture-handler';

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
    getStreakRecommendations: bindActionCreators(streakRecommendationActions.getStreakRecommendations, dispatch),
    clearGetStreakRecommendationsErrorMessage: bindActionCreators(
        streakRecommendationActions.clearGetStreakRecommendationsErrorMessage,
        dispatch,
    ),
    selectStreakRecommendation: bindActionCreators(streakRecommendationActions.selectStreakRecommendation, dispatch),
});

type StreakRecommendationsScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.StreakRecommendations>;
type StreakRecommendationsScreenRouteProp = RouteProp<RootStackParamList, Screens.StreakRecommendations>;

type NavigationProps = {
    navigation: StreakRecommendationsScreenNavigationProp;
    route: StreakRecommendationsScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

class StreakRecommendationsScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getStreakRecommendations({ random: true, limit: 10, sortedByNumberOfMembers: true });
    }
    renderStreakSelectButton(streakRecommendation: StreakRecommendationWithClientData): JSX.Element {
        const { hasBeenSelected, _id } = streakRecommendation;
        const streakSelectButton = hasBeenSelected ? (
            <Button icon={<FontAwesomeIcon icon={faCheck} />} buttonStyle={{ backgroundColor: 'green' }} disabled />
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
        const { getStreakRecommendations, getStreakRecommendationsIsLoading, streakRecommendations } = this.props;
        return (
            <ScrollView style={styles.container}>
                <>
                    <Spacer>
                        <View style={{ alignItems: 'center' }}>
                            <Text>{`Oid uses artificial intelligence to recommend streaks for you`}</Text>
                        </View>
                    </Spacer>
                    <Spacer>
                        <Button
                            buttonStyle={{ backgroundColor: 'green' }}
                            icon={<FontAwesomeIcon icon={faRocketLaunch} color="white" />}
                            onPress={() => {
                                getStreakRecommendations({ random: true, limit: 10, sortedByNumberOfMembers: true });
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                navigation={this.props.navigation as any}
                                text="Streaks are added to your Challenge streaks"
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
