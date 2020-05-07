import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Button, Text } from 'react-native-elements';
import { FlatList, ScrollView, NavigationEvents } from 'react-navigation';
import { AppState, AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { Screens } from '../Screens';
import NavigationService from '../NavigationService';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRocketLaunch } from '@fortawesome/pro-solid-svg-icons';
import { Spacer } from '../../components/Spacer';
import { streakRecommendationActions } from '../../actions/sharedActions';
import { ChallengeIcon } from '../../components/ChallengeIcon';

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

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

class StreakRecommendationsIntroScreenComponent extends React.Component<Props> {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        const { streakRecommendations } = this.props;
        return (
            <ScrollView style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => {
                        this.props.getRandomStreakRecommendations();
                    }}
                />
                <Spacer />
                <Spacer>
                    <Text h4> Get personalized challenge recommendations.</Text>
                </Spacer>
                <Spacer>
                    <Button
                        buttonStyle={{ backgroundColor: 'green' }}
                        icon={<FontAwesomeIcon icon={faRocketLaunch} color="white" />}
                        onPress={() => {
                            this.props.getRandomStreakRecommendations();
                        }}
                    />
                </Spacer>
                <Spacer>
                    <FlatList
                        data={streakRecommendations}
                        keyExtractor={(streakRecommendation) => streakRecommendation._id}
                        renderItem={({ item }) => {
                            return (
                                <ListItem
                                    leftIcon={<ChallengeIcon icon={item.icon} color={item.color} />}
                                    title={item.name}
                                />
                            );
                        }}
                    />
                </Spacer>
                <Spacer>
                    <Button title="Next" onPress={() => NavigationService.navigate(Screens.DailyReminders)} />
                </Spacer>
            </ScrollView>
        );
    }
}

const StreakRecommendationsIntroScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StreakRecommendationsIntroScreenComponent);

export { StreakRecommendationsIntroScreen };
