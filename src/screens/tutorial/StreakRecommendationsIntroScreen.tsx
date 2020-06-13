import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Button, Text } from 'react-native-elements';
import { AppState, AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { Screens } from '../Screens';
import { connect } from 'react-redux';
import { Spacer } from '../../components/Spacer';
import { streakRecommendationActions } from '../../actions/authenticatedSharedActions';
import { ChallengeIcon } from '../../components/ChallengeIcon';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';

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

type StreakRecommendationsIntroScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    Screens.StreakRecommendationsIntro
>;
type StreakRecommendationsIntroScreenRouteProp = RouteProp<RootStackParamList, Screens.StreakRecommendationsIntro>;

type NavigationProps = {
    navigation: StreakRecommendationsIntroScreenNavigationProp;
    route: StreakRecommendationsIntroScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const streakLimit = 6;

class StreakRecommendationsIntroScreenComponent extends React.PureComponent<Props> {
    componentDidMount() {
        this.props.getStreakRecommendations({ random: true, limit: streakLimit, sortedByNumberOfMembers: true });
    }

    render(): JSX.Element {
        const { streakRecommendations } = this.props;
        return (
            <ScrollView style={styles.container}>
                <Spacer>
                    <Text>Get recommendations for new habits to build</Text>
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
                    <Button title="Next" onPress={() => this.props.navigation.push(Screens.DailyReminders)} />
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
