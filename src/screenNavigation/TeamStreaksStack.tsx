/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faEdit, faShareAlt } from '@fortawesome/pro-solid-svg-icons';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { View, ActivityIndicator, Share } from 'react-native';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { streakoidUrl } from '../streakoidUrl';
import { TeamStreaksScreen } from '../screens/TeamStreaksScreen';
import { TeamStreakInfoScreen } from '../screens/TeamStreakInfoScreen';
import { CreateTeamStreakScreen } from '../screens/CreateTeamStreakScreen';
import { EditTeamStreakScreen } from '../screens/EditTeamStreakScreen';
import { AddFollowerToTeamStreakScreen } from '../screens/AddFollowerToTeamStreakScreen';
import { TeamMemberStreakInfoScreen } from '../screens/TeamMemberStreakInfoScreen';
import { AddNoteToTeamStreakScreen } from '../screens/AddNoteToTeamStreakScreen';

export type TeamStreakStackParamList = {
    TeamStreaks: { isPayingMember: boolean; totalLiveStreaks: number; getMultipleLiveTeamStreaksIsLoading: boolean };
    TeamStreakInfo: { _id: string; streakName: string; userIsApartOfStreak: boolean };
    CreateTeamStreak: undefined;
    EditTeamStreak: undefined;
    AddFollowerToTeamStreak: undefined;
    TeamMemberStreakInfo: { _id: string; streakName: string };
    AddNoteToSoloStreak: undefined;
    AddNoteToChallengeStreak: undefined;
    AddNoteToTeamStreak: undefined;
};

const Stack = createStackNavigator<TeamStreakStackParamList>();

const TeamStreaksStackScreen = (
    <Stack.Screen
        name={Screens.TeamStreaks}
        component={TeamStreaksScreen}
        initialParams={{ isPayingMember: false, totalLiveStreaks: 0 }}
        options={({ route, navigation }) => ({
            title: 'Team Streaks',
            headerRight: () => {
                const userHasReachedFreeStreakLimit =
                    !route.params.isPayingMember && route.params.totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
                return (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                        onPress={() => {
                            if (!userHasReachedFreeStreakLimit) {
                                return navigation.navigate(Screens.CreateTeamStreak);
                            }
                            navigation.navigate(Screens.Upgrade);
                        }}
                    />
                );
            },
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <HamburgerSelector />
                    {route.params.getMultipleLiveTeamStreaksIsLoading ? <ActivityIndicator /> : null}
                </View>
            ),
        })}
    />
);

const TeamStreakInfoStackScreen = (
    <Stack.Screen
        name={Screens.TeamStreakInfo}
        component={TeamStreakInfoScreen}
        options={({ route, navigation }) => ({
            title: route.params.streakName,
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    {route.params.userIsApartOfStreak ? (
                        <Button
                            type="clear"
                            icon={<FontAwesomeIcon icon={faEdit} />}
                            onPress={() => navigation.push(Screens.EditTeamStreak)}
                        />
                    ) : null}
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faShareAlt} />}
                        onPress={async () => {
                            await Share.share({
                                message: `View team streak ${route.params.streakName} at ${streakoidUrl}/${RouterCategories.teamStreaks}/${route.params._id}`,
                                url: `${streakoidUrl}/${RouterCategories.teamStreaks}/${route.params._id}`,
                                title: `View Streakoid team streak ${route.params.streakName}`,
                            });
                        }}
                    />
                </View>
            ),
        })}
    />
);

const CreateTeamTeamStreakStackScreen = (
    <Stack.Screen
        name={Screens.CreateTeamStreak}
        component={CreateTeamStreakScreen}
        options={() => ({
            title: 'Create team streak',
        })}
    />
);

const EditTeamTeamStreakStackScreen = <Stack.Screen name={Screens.EditTeamStreak} component={EditTeamStreakScreen} />;

const AddFollowerToTeamTeamStreakStackScreen = (
    <Stack.Screen
        name={Screens.AddFollowerToTeamStreak}
        component={AddFollowerToTeamStreakScreen}
        options={() => ({
            title: 'Add follower to team streak',
        })}
    />
);

const TeamMemberStreakInfoStackScreen = (
    <Stack.Screen
        name={Screens.TeamMemberStreakInfo}
        component={TeamMemberStreakInfoScreen}
        options={({ route }) => ({
            title: route.params.streakName,
            headerRight: () => (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faShareAlt} />}
                    onPress={async () => {
                        await Share.share({
                            message: `View team member streak ${route.params.streakName} at ${streakoidUrl}/${RouterCategories.teamMemberStreaks}/${route.params._id}`,
                            url: `${streakoidUrl}/${RouterCategories.teamMemberStreaks}/${route.params._id}`,
                            title: `View Streakoid team member streak ${route.params.streakName}`,
                        });
                    }}
                />
            ),
        })}
    />
);

const AddNoteToTeamTeamStreakStackScreen = (
    <Stack.Screen name={Screens.AddNoteToTeamStreak} component={AddNoteToTeamStreakScreen} />
);

const TeamStreaksStack = () => (
    <Stack.Navigator>
        {TeamStreaksStackScreen}
        {TeamStreakInfoStackScreen}
        {CreateTeamTeamStreakStackScreen}
        {EditTeamTeamStreakStackScreen}
        {AddFollowerToTeamTeamStreakStackScreen}
        {TeamMemberStreakInfoStackScreen}
        {AddNoteToTeamTeamStreakStackScreen}
    </Stack.Navigator>
);

export { TeamStreaksStack };
