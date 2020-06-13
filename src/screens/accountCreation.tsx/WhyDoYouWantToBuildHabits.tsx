import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { View, StyleSheet } from 'react-native';
import { userActions } from '../../actions/authenticatedSharedActions';
import WhyDoYouWantToBuildNewHabitsTypes from '@streakoid/streakoid-models/lib/Types/WhyDoYouWantToBuildNewHabitsTypes';
import {
    IconDefinition,
    faQuestion,
    faHandsHelping,
    faHiking,
    faHeart,
    faBrain,
    faHammerWar,
    faSparkles,
    faLevelUp,
    faBriefcase,
} from '@fortawesome/pro-solid-svg-icons';
import uuid from 'react-native-uuid';
import { Spacer } from '../../components/Spacer';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Screens } from '../Screens';
import { authActions } from '../../actions/unauthenticatedSharedActions';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const isAuthenticated = state && state.auth && state.auth.isAuthenticated;
    const currentUser = state && state.users && state.users.currentUser;
    return {
        isAuthenticated,
        currentUser,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    registerWithUserIdentifier: bindActionCreators(authActions.registerWithUserIdentifier, dispatch),
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
});

type WhyDoYouWantToBuildHabitsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    Screens.WhyDoYouWantToBuildHabits
>;
type WhyDoYouWantToBuildHabitsScreenRouteProp = RouteProp<RootStackParamList, Screens.WhyDoYouWantToBuildHabits>;

type NavigationProps = {
    navigation: WhyDoYouWantToBuildHabitsScreenNavigationProp;
    route: WhyDoYouWantToBuildHabitsScreenRouteProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class WhyDoYouWantToBuildHabitsScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        const { isAuthenticated } = this.props;
        const userIdentifier = uuid.v4();
        if (userIdentifier && !isAuthenticated) {
            this.props.registerWithUserIdentifier({ userIdentifier });
        }
    }
    render(): JSX.Element {
        const job = { _id: '1', type: WhyDoYouWantToBuildNewHabitsTypes.job, icon: faBriefcase, color: 'black' };
        const selfImprovement = {
            _id: '2',
            type: WhyDoYouWantToBuildNewHabitsTypes.selfImprovement,
            icon: faLevelUp,
            color: 'blue',
        };
        const wantToTrySomethingNew = {
            _id: '3',
            type: WhyDoYouWantToBuildNewHabitsTypes.wantToTrySomethingNew,
            icon: faSparkles,
            color: 'gold',
        };
        const pursuitOfMastery = {
            _id: '4',
            type: WhyDoYouWantToBuildNewHabitsTypes.pursuitOfMastery,
            icon: faHammerWar,
            color: 'brown',
        };
        const education = {
            _id: '5',
            type: WhyDoYouWantToBuildNewHabitsTypes.education,
            icon: faBrain,
            color: 'pink',
        };
        const health = {
            _id: '6',
            type: WhyDoYouWantToBuildNewHabitsTypes.health,
            icon: faHeart,
            color: 'red',
        };
        const tryingToBeBetter = {
            _id: '7',
            type: WhyDoYouWantToBuildNewHabitsTypes.tryingToBeBetter,
            icon: faHiking,
            color: 'purple',
        };
        const someoneToldMeTo = {
            _id: '8',
            type: WhyDoYouWantToBuildNewHabitsTypes.someoneToldMeTo,
            icon: faHandsHelping,
            color: 'red',
        };
        const other = {
            _id: '9',
            type: WhyDoYouWantToBuildNewHabitsTypes.other,
            icon: faQuestion,
            color: 'black',
        };
        const reasonsToBuildNewHabits: {
            _id: string;
            type: WhyDoYouWantToBuildNewHabitsTypes;
            icon: IconDefinition;
            color: string;
        }[] = [
            wantToTrySomethingNew,
            selfImprovement,
            job,
            pursuitOfMastery,
            education,
            health,
            tryingToBeBetter,
            someoneToldMeTo,
            other,
        ];
        return (
            <View style={styles.container}>
                <Spacer>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>{'Why do you want to build new habits?'}</Text>
                    </Spacer>

                    <FlatList
                        data={reasonsToBuildNewHabits}
                        keyExtractor={(option) => option._id}
                        renderItem={({ item }) => {
                            return (
                                <ListItem
                                    leftIcon={<FontAwesomeIcon icon={item.icon} color={item.color} />}
                                    title={item.type}
                                    chevron={true}
                                    onPress={() => {
                                        this.props.updateCurrentUser({
                                            updateData: {
                                                onboarding: {
                                                    whyDoYouWantToBuildNewHabitsChoice: item.type,
                                                },
                                            },
                                        });
                                        this.props.navigation.navigate(Screens.CompletedCustomization);
                                    }}
                                />
                            );
                        }}
                    />
                </Spacer>
            </View>
        );
    }
}

const WhyDoYouWantToBuildHabitsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WhyDoYouWantToBuildHabitsScreenComponent);

export { WhyDoYouWantToBuildHabitsScreen };
