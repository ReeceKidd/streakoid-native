/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { SoloStreaksScreen } from '../screens/SoloStreaksScreen';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faEdit, faShareAlt } from '@fortawesome/pro-solid-svg-icons';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { View, ActivityIndicator, Share } from 'react-native';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';
import { SoloStreakInfoScreen } from '../screens/SoloStreakInfoScreen';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { streakoidUrl } from '../streakoidUrl';
import { CreateSoloStreakScreen } from '../screens/CreateSoloStreakScreen';
import { EditSoloStreakScreen } from '../screens/EditSoloStreakScreen';
import { ChallengeStreaksScreen } from '../screens/ChallengeStreaksScreen';
import { ChallengeStreakInfoScreen } from '../screens/ChallengeStreakInfoScreen';
import { TeamStreaksScreen } from '../screens/TeamStreaksScreen';
import { TeamStreakInfoScreen } from '../screens/TeamStreakInfoScreen';
import { CreateTeamStreakScreen } from '../screens/CreateTeamStreakScreen';
import { EditTeamStreakScreen } from '../screens/EditTeamStreakScreen';
import { AddFollowerToTeamStreakScreen } from '../screens/AddFollowerToTeamStreakScreen';
import { TeamMemberStreakInfoScreen } from '../screens/TeamMemberStreakInfoScreen';
import { AddNoteToSoloStreakScreen } from '../screens/AddNoteToSoloStreakScreen';
import { AddNoteToChallengeStreakScreen } from '../screens/AddNoteToChallengeStreakScreen';
import { AddNoteToTeamStreakScreen } from '../screens/AddNoteToTeamStreakScreen';
import { HomeScreen } from '../screens/HomeScreen';

export type StreakStackParamList = {
    Home: { userId: string };
    SoloStreaks: { isPayingMember: boolean; totalLiveStreaks: number; getMultipleLiveSoloStreaksIsLoading: boolean };
    SoloStreakInfo: { _id: string; streakName: string; isUsersStreak: boolean };
    CreateSoloStreak: undefined;
    EditSoloStreak: undefined;
    ChallengeStreaks: {
        isPayingMember: boolean;
        totalLiveStreaks: number;
        getMultipleLiveChallengeStreaksIsLoading: boolean;
    };
    ChallengeStreakInfo: { _id: string; streakName: string };
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

const Stack = createStackNavigator<StreakStackParamList>();

const HomeStackScreen = (
    <Stack.Screen
        name={Screens.Home}
        component={HomeScreen}
        options={() => ({
            title: 'Streaks',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

const SoloStreakStackScreen = (
    <Stack.Screen
        name={Screens.SoloStreaks}
        component={SoloStreaksScreen}
        options={({ route, navigation }) => ({
            title: 'Solo Streaks',
            headerRight: () => {
                const userHasReachedFreeStreakLimit =
                    !route.params.isPayingMember && route.params.totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
                return (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                        onPress={() => {
                            if (!userHasReachedFreeStreakLimit) {
                                return navigation.push(Screens.CreateSoloStreak);
                            }
                            navigation.push(Screens.Upgrade);
                        }}
                    />
                );
            },
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <HamburgerSelector />
                    {route.params.getMultipleLiveSoloStreaksIsLoading ? <ActivityIndicator /> : null}
                </View>
            ),
        })}
    />
);

const SoloStreakInfoStackScreen = (
    <Stack.Screen
        name={Screens.SoloStreakInfo}
        component={SoloStreakInfoScreen}
        options={({ route, navigation }) => ({
            title: route.params.streakName,
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    {route.params.isUsersStreak ? (
                        <Button
                            type="clear"
                            icon={<FontAwesomeIcon icon={faEdit} />}
                            onPress={() => navigation.push(Screens.EditSoloStreak)}
                        />
                    ) : null}
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faShareAlt} />}
                        onPress={async () => {
                            await Share.share({
                                message: `View solo streak ${route.params.streakName} at ${streakoidUrl}/${RouterCategories.soloStreaks}/${route.params._id}`,
                                url: `${streakoidUrl}/${RouterCategories.soloStreaks}/${route.params._id}`,
                                title: `View Streakoid solo streak ${route.params.streakName}`,
                            });
                        }}
                    />
                </View>
            ),
        })}
    />
);

const CreateSoloStreakStackScreen = <Stack.Screen name={Screens.CreateSoloStreak} component={CreateSoloStreakScreen} />;

const EditSoloStreakStackScreen = <Stack.Screen name={Screens.EditSoloStreak} component={EditSoloStreakScreen} />;

const ChallengeStreaksStackScreen = (
    <Stack.Screen
        name={Screens.ChallengeStreaks}
        component={ChallengeStreaksScreen}
        options={({ route, navigation }) => ({
            title: 'Challenge Streaks',
            headerRight: () => {
                return (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                        onPress={() => {
                            const userHasReachedFreeStreakLimit =
                                !route.params.isPayingMember &&
                                route.params.totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
                            if (!userHasReachedFreeStreakLimit) {
                                return navigation.push(Screens.Challenges);
                            }
                            navigation.push(Screens.Upgrade);
                        }}
                    />
                );
            },
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <HamburgerSelector />
                    {route.params.getMultipleLiveChallengeStreaksIsLoading ? <ActivityIndicator /> : null}
                </View>
            ),
        })}
    />
);

const ChallengeStreakInfoStackScreen = (
    <Stack.Screen
        name={Screens.ChallengeStreakInfo}
        component={ChallengeStreakInfoScreen}
        options={({ route }) => ({
            title: route.params.streakName,
            headerRight: () => (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faShareAlt} />}
                    onPress={async () => {
                        await Share.share({
                            message: `View challenge streak ${route.params.streakName} at ${streakoidUrl}/${RouterCategories.challengeStreaks}/${route.params._id}`,
                            url: `${streakoidUrl}/${RouterCategories.challengeStreaks}/${route.params._id}`,
                            title: `View Streakoid challenge streak ${route.params.streakName}`,
                        });
                    }}
                />
            ),
        })}
    />
);

const TeamStreaksStackScreen = (
    <Stack.Screen
        name={Screens.TeamStreaks}
        component={TeamStreaksScreen}
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

const CreateTeamStreakStackScreen = (
    <Stack.Screen
        name={Screens.CreateTeamStreak}
        component={CreateTeamStreakScreen}
        options={() => ({
            title: 'Create team streak',
        })}
    />
);

const EditTeamStreakStackScreen = <Stack.Screen name={Screens.EditTeamStreak} component={EditTeamStreakScreen} />;

const AddFollowerToTeamStreakStackScreen = (
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

const AddNoteToSoloStreakStackScreen = (
    <Stack.Screen name={Screens.AddNoteToSoloStreak} component={AddNoteToSoloStreakScreen} />
);

const AddNoteToChallengeStreakStackScreen = (
    <Stack.Screen name={Screens.AddNoteToChallengeStreak} component={AddNoteToChallengeStreakScreen} />
);

const AddNoteToTeamStreakStackScreen = (
    <Stack.Screen name={Screens.AddNoteToTeamStreak} component={AddNoteToTeamStreakScreen} />
);

const StreakStack = () => (
    <Stack.Navigator>
        {HomeStackScreen}
        {SoloStreakStackScreen}
        {SoloStreakInfoStackScreen}
        {CreateSoloStreakStackScreen}
        {EditSoloStreakStackScreen}
        {ChallengeStreaksStackScreen}
        {ChallengeStreakInfoStackScreen}
        {TeamStreaksStackScreen}
        {TeamStreakInfoStackScreen}
        {CreateTeamStreakStackScreen}
        {EditTeamStreakStackScreen}
        {AddFollowerToTeamStreakStackScreen}
        {TeamMemberStreakInfoStackScreen}
        {AddNoteToSoloStreakStackScreen}
        {AddNoteToChallengeStreakStackScreen}
        {AddNoteToTeamStreakStackScreen}
    </Stack.Navigator>
);

export { StreakStack };
