import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, TouchableOpacity, Platform } from 'react-native';

import { AppState } from '../../store';
import { Spacer } from '../components/Spacer';
import { challengeActions } from '../actions/authenticatedSharedActions';
import { Screens } from './Screens';
import { ListItem, Divider, Text, SearchBar } from 'react-native-elements';
import { ChallengeIcon } from '../components/ChallengeIcon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUsers } from '@fortawesome/pro-solid-svg-icons';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const challengeList = state && state.challenges && state.challenges.challengeList;
    const getAllChallengesIsLoading = state && state.challenges && state.challenges.getAllChallengesIsLoading;
    return { challengeList, getAllChallengesIsLoading };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getChallenges: bindActionCreators(challengeActions.getChallenges, dispatch),
});

type ChallengesScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.Challenges>;
type ChallengesScreenRouteProp = RouteProp<RootStackParamList, Screens.Challenges>;

type NavigationProps = {
    navigation: ChallengesScreenNavigationProp;
    route: ChallengesScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

interface State {
    searchQuery: string;
}

class ChallengesScreenComponent extends PureComponent<Props, State> {
    state: State = {
        searchQuery: '',
    };

    componentDidMount() {
        this.props.getChallenges({ limit: 20 });
    }

    updateSearch = (searchQuery: string) => {
        this.setState({ searchQuery });
        this.props.getChallenges({ searchQuery, limit: 20 });
    };

    render(): JSX.Element {
        const { challengeList } = this.props;
        let platform: 'default' | 'ios' | 'android' = 'default';
        if (Platform.OS === 'ios') {
            platform = 'ios';
        }
        if (Platform.OS === 'android') {
            platform = 'android';
        }
        return (
            <ScrollView>
                <Spacer>
                    <SearchBar
                        platform={platform}
                        placeholder={`Search for challenge`}
                        onChangeText={this.updateSearch}
                        value={this.state.searchQuery}
                        showLoading={this.props.getAllChallengesIsLoading}
                    />
                    {challengeList && challengeList.length > 0 ? (
                        <FlatList
                            data={challengeList}
                            keyExtractor={(challenge: Challenge) => challenge._id}
                            renderItem={({ item }) => {
                                const { _id, name, icon, color, members } = item;
                                return (
                                    <View>
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.navigation.navigate(Screens.ChallengeInfo, {
                                                    challengeName: name,
                                                    _id,
                                                })
                                            }
                                        >
                                            <ListItem
                                                chevron
                                                title={name}
                                                leftIcon={<ChallengeIcon icon={icon} color={color ? color : 'black'} />}
                                                rightElement={
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text />
                                                        <Text style={{ textAlignVertical: 'center' }}>
                                                            <FontAwesomeIcon icon={faUsers} size={15} />
                                                        </Text>
                                                        <Text style={{ marginLeft: 3 }}>{members.length}</Text>
                                                    </View>
                                                }
                                            />
                                        </TouchableOpacity>
                                        <Divider />
                                    </View>
                                );
                            }}
                        />
                    ) : (
                        <Text>No challenges found</Text>
                    )}
                </Spacer>
            </ScrollView>
        );
    }
}

export const ChallengesScreen = connect(mapStateToProps, mapDispatchToProps)(ChallengesScreenComponent);
