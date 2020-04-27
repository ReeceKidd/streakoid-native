import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { NavigationScreenProp, NavigationState, NavigationParams, NavigationEvents } from 'react-navigation';

import { AppState } from '../../store';
import { userActions } from '../actions/sharedActions';
import { UsersList } from '../components/UsersList';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { ScrollView } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    return {
        currentUser,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getUsers: bindActionCreators(userActions.getUsers, dispatch),
    getCurrentUser: bindActionCreators(userActions.getCurrentUser, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class UsersScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Users',
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    render(): JSX.Element {
        const { getCurrentUser } = this.props;
        return (
            <ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        getCurrentUser();
                    }}
                />
                <Spacer>
                    <UsersList navigation={this.props.navigation} />
                </Spacer>
            </ScrollView>
        );
    }
}

const UsersScreen = connect(mapStateToProps, mapDispatchToProps)(UsersScreenComponent);
export { UsersScreen };
