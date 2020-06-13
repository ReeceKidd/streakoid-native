/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { AccountScreen } from '../screens/AccountScreen';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { Share, View, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShareAlt } from '@fortawesome/pro-solid-svg-icons';
import { streakoidUrl } from '../streakoidUrl';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { WhyDoYouWantToBuildHabitsScreen } from '../screens/accountCreation.tsx/WhyDoYouWantToBuildHabits';
import { WhatIsYourFirstNameScreen } from '../screens/accountCreation.tsx/WhatIsYourFirstNameScreen';
import { WhatIsYourLastNameScreen } from '../screens/accountCreation.tsx/WhatIsYourLastNameScreen';
import { ChooseAUsernameScreen } from '../screens/accountCreation.tsx/ChooseAUsernameScreen';
import { ChooseAProfilePictureScreen } from '../screens/accountCreation.tsx/ChooseAProfilePictureScreen';
import { WhatIsYourEmailScreen } from '../screens/registration/WhatIsYourEmailScreen';
import { VerifyEmailScreen } from '../screens/registration/VerifyEmailScreen';
import { ChooseAPasswordScreen } from '../screens/registration/ChooseAPasswordScreen';
import { CompletedRegistrationScreen } from '../screens/registration/CompletedRegistrationScreen';
import { CompletedCustomizationScreen } from '../screens/accountCreation.tsx/CompletedCustomizationScreen';
import { ChallengesScreen } from '../screens/ChallengesScreen';
import { ChallengeInfoScreen } from '../screens/ChallengeInfoScreen';
import { ChallengeStreaksScreen } from '../screens/ChallengeStreaksScreen';
import { ChallengeStreakInfoScreen } from '../screens/ChallengeStreakInfoScreen';
import { AddNoteToChallengeStreakScreen } from '../screens/AddNoteToChallengeStreakScreen';
import { faPlus, faEdit } from '@fortawesome/pro-light-svg-icons';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';
import { LeaderboardsScreen } from '../screens/LeaderboardsScreen';
import { SoloStreakLeaderboardScreen } from '../screens/SoloStreakLeaderboardScreen';
import { TeamStreakLeaderboardScreen } from '../screens/TeamStreakLeaderboardScreen';
import { ChallengeStreakLeaderboardScreen } from '../screens/ChallengeStreakLeaderboardScreen';
import { FollowingLeaderboardScreen } from '../screens/FollowingLeaderboardScreen';
import { GlobalUserLeaderboardScreen } from '../screens/GlobalLeaderboardScreen';
import { LandingScreen } from '../screens/LandingScreen';
import { MadeAnAccountScreen } from '../screens/onboarding/MadeAnAccountScreen';
import { ChooseAPathScreen } from '../screens/onboarding/ChooseAPathScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { UpdatePasswordScreen } from '../screens/UpdatePasswordScreen';
import { SoloStreaksScreen } from '../screens/SoloStreaksScreen';
import { SoloStreakInfoScreen } from '../screens/SoloStreakInfoScreen';
import { CreateSoloStreakScreen } from '../screens/CreateSoloStreakScreen';
import { EditSoloStreakScreen } from '../screens/EditSoloStreakScreen';
import { AddNoteToSoloStreakScreen } from '../screens/AddNoteToSoloStreakScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { StreakRecommendationsScreen } from '../screens/StreakRecommendationsScreen';
import { TeamStreaksScreen } from '../screens/TeamStreaksScreen';
import { TeamStreakInfoScreen } from '../screens/TeamStreakInfoScreen';
import { CreateTeamStreakScreen } from '../screens/CreateTeamStreakScreen';
import { AddFollowerToTeamStreakScreen } from '../screens/AddFollowerToTeamStreakScreen';
import { TeamMemberStreakInfoScreen } from '../screens/TeamMemberStreakInfoScreen';
import { AddNoteToTeamStreakScreen } from '../screens/AddNoteToTeamStreakScreen';
import { EditTeamStreakScreen } from '../screens/EditTeamStreakScreen';
import { WhatIsAStreakScreen } from '../screens/tutorial/WhatIsAStreakScreen';
import { WhyDailyStreaksScreen } from '../screens/tutorial/WhyDailyStreaksScreen';
import { DifferentTypesOfStreaksScreen } from '../screens/tutorial/DifferentTypesOfStreaksScreen';
import { StreakRecommendationsIntroScreen } from '../screens/tutorial/StreakRecommendationsIntroScreen';
import { DailyReminderScreen } from '../screens/tutorial/DailyReminderScreen';
import { TutorialCompleteScreen } from '../screens/tutorial/TutorialCompleteScreen';
import { UpgradeScreen } from '../screens/UpgradeScreen';
import { UsersScreen } from '../screens/UsersScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { FollowingActivityScreen } from '../screens/FollowingActivityScreen';
import { GlobalActivityScreen } from '../screens/GlobalActivityScreen';

export type RootStackParamList = {
    Home: undefined;
    [Screens.Account]: { username: string };
    [Screens.WhyDoYouWantToBuildHabits]: undefined;
    WhatIsYourFirstName: undefined;
    WhatIsYourLastName: undefined;
    ChooseAUsername: undefined;
    ChooseAProfilePicture: undefined;
    WhatIsYourEmail: undefined;
    VerifyEmail: undefined;
    ChooseAPassword: undefined;
    CompletedRegistration: undefined;
    CompletedCustomization: undefined;
    GlobalActivity: undefined;
    FollowingActivity: undefined;
    Challenges: undefined;
    ChallengeInfo: { _id: string; challengeName: string };
    ChallengeStreaks: {
        isPayingMember: boolean;
        totalLiveStreaks: number;
        getMultipleLiveChallengeStreaksIsLoading: boolean;
    };
    ChallengeStreakInfo: { _id: string; streakName: string };
    AddNoteToChallengeStreak: undefined;
    Leaderboards: undefined;
    SoloStreakLeaderboard: undefined;
    TeamStreakLeaderboard: undefined;
    ChallengeStreakLeaderboard: undefined;
    FollowingLeaderboard: undefined;
    GlobalUserLeaderboard: undefined;
    //Onboarding
    Landing: undefined;
    MadeAnAccount: undefined;
    ChooseAPath: undefined;
    Login: undefined;
    ForgotPassword: undefined;
    UpdatePassword: undefined;
    //Solo Streak
    SoloStreaks: { isPayingMember: boolean; totalLiveStreaks: number; getMultipleLiveSoloStreaksIsLoading: boolean };
    SoloStreakInfo: { _id: string; streakName: string; isUsersStreak: boolean };
    CreateSoloStreak: undefined;
    EditSoloStreak: undefined;
    AddNoteToSoloStreak: undefined;
    StreakRecommendations: undefined;
    //TeamStreak
    TeamStreaks: { isPayingMember: boolean; totalLiveStreaks: number; getMultipleLiveTeamStreaksIsLoading: boolean };
    TeamStreakInfo: { _id: string; streakName: string; userIsApartOfStreak: boolean };
    CreateTeamStreak: undefined;
    EditTeamStreak: undefined;
    AddFollowerToTeamStreak: undefined;
    TeamMemberStreakInfo: { _id: string; streakName: string };
    AddNoteToTeamStreak: undefined;
    //Tutorial
    WhatIsAStreak: undefined;
    WhyDailyStreaks: undefined;
    DifferentTypesOfStreaks: undefined;
    StreakRecommendationsIntro: undefined;
    DailyReminders: undefined;
    TutorialComplete: undefined;
    //Upgrade
    Upgrade: undefined;
    //Users
    Users: undefined;
    UserProfile: { _id: string; username: string };
};

const Stack = createStackNavigator<RootStackParamList>();

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

const AccountStackScreen = (
    <Stack.Screen
        name={Screens.Account}
        component={AccountScreen}
        initialParams={{ username: '' }}
        options={({ route }) => ({
            title: route.params.username,
            headerLeft: () => <HamburgerSelector />,
            headerRight: () => (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faShareAlt} />}
                    onPress={async () => {
                        await Share.share({
                            message: `View my Streakoid profile at ${streakoidUrl}/${RouterCategories.users}/${route.params.username}`,
                            url: `${streakoidUrl}/${RouterCategories.users}/${route.params.username}`,
                            title: 'View my Streakoid profile',
                        });
                    }}
                />
            ),
        })}
    />
);

const WhyDoYouWantToBuildHabitsStackScreen = (
    <Stack.Screen
        name={Screens.WhyDoYouWantToBuildHabits}
        options={{ headerShown: false }}
        component={WhyDoYouWantToBuildHabitsScreen}
    />
);

const WhatIsYourFirstNameStackScreen = (
    <Stack.Screen
        name={Screens.WhatIsYourFirstName}
        options={{ title: 'What is your first name?', headerLeft: () => null }}
        component={WhatIsYourFirstNameScreen}
    />
);

const WhatIsYourLastNameStackScreen = (
    <Stack.Screen
        name={Screens.WhatIsYourLastName}
        options={{ title: 'What is your last name?', headerLeft: () => null }}
        component={WhatIsYourLastNameScreen}
    />
);

const ChooseAUsernameStackScreen = (
    <Stack.Screen
        name={Screens.ChooseAUsername}
        options={{ title: 'Choose a username', headerLeft: () => null }}
        component={ChooseAUsernameScreen}
    />
);

const ChooseAProfilePictureStackScreen = (
    <Stack.Screen
        name={Screens.ChooseAProfilePicture}
        options={{ headerShown: false }}
        component={ChooseAProfilePictureScreen}
    />
);

const WhatIsYourEmailStackScreen = (
    <Stack.Screen
        name={Screens.WhatIsYourEmail}
        options={{ title: 'What is your email?', headerLeft: () => null }}
        component={WhatIsYourEmailScreen}
    />
);

const VerifyEmailStackScreen = (
    <Stack.Screen name={Screens.VerifyEmail} options={{ headerShown: false }} component={VerifyEmailScreen} />
);

const ChooseAPasswordStackScreen = (
    <Stack.Screen name={Screens.ChooseAPassword} options={{ headerShown: false }} component={ChooseAPasswordScreen} />
);

const CompletedRegistrationStackScreen = (
    <Stack.Screen
        name={Screens.CompletedRegistration}
        options={{ headerShown: false }}
        component={CompletedRegistrationScreen}
    />
);

const CompletedCustomizationStackScreen = (
    <Stack.Screen
        name={Screens.CompletedCustomization}
        options={{ headerShown: false }}
        component={CompletedCustomizationScreen}
    />
);

const FollowingActivityStackScreen = (
    <Stack.Screen
        name={Screens.FollowingActivity}
        component={FollowingActivityScreen}
        options={() => ({
            title: 'Following Activity',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

const GlobalActivityStackScreen = (
    <Stack.Screen
        name={Screens.GlobalActivity}
        component={GlobalActivityScreen}
        options={() => ({
            title: 'Global Activity ',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

const ChallengesStackScreen = (
    <Stack.Screen
        name={Screens.Challenges}
        component={ChallengesScreen}
        options={() => ({
            title: 'Challenges',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

const ChallengeInfoStackScreen = (
    <Stack.Screen
        name={Screens.ChallengeInfo}
        component={ChallengeInfoScreen}
        options={({ route }) => ({
            title: route.params.challengeName,
            headerRight: () =>
                route.params.challengeName ? (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faShareAlt} />}
                        onPress={async () => {
                            await Share.share({
                                message: `Join the ${route.params.challengeName} challenge at ${streakoidUrl}/${RouterCategories.challenges}/${route.params._id}`,
                                url: `${streakoidUrl}/${RouterCategories.challenges}/${route.params._id}`,
                                title: `Join the ${route.params.challengeName} challenge`,
                            });
                        }}
                    />
                ) : null,
        })}
    />
);

const ChallengeStreaksStackScreen = (
    <Stack.Screen
        name={Screens.ChallengeStreaks}
        initialParams={{ getMultipleLiveChallengeStreaksIsLoading: false, totalLiveStreaks: 0 }}
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

const AddNoteToChallengeStreaksStackScreen = (
    <Stack.Screen name={Screens.AddNoteToChallengeStreak} component={AddNoteToChallengeStreakScreen} />
);

const LeaderboardsStackScreen = (
    <Stack.Screen
        name={Screens.Leaderboards}
        component={LeaderboardsScreen}
        options={() => ({
            title: 'Leaderboards',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

const SoloStreakLeaderboardStackScreen = (
    <Stack.Screen name={Screens.SoloStreakLeaderboard} component={SoloStreakLeaderboardScreen} />
);
const TeamStreakLeaderboardStackScreen = (
    <Stack.Screen name={Screens.TeamStreakLeaderboard} component={TeamStreakLeaderboardScreen} />
);
const ChallengeStreakLeaderboardStackScreen = (
    <Stack.Screen name={Screens.ChallengeStreakLeaderboard} component={ChallengeStreakLeaderboardScreen} />
);
const FollowingLeaderboardStackScreen = (
    <Stack.Screen name={Screens.FollowingLeaderboard} component={FollowingLeaderboardScreen} />
);
const GlobalUserLeaderboardStackScreen = (
    <Stack.Screen name={Screens.GlobalUserLeaderboard} component={GlobalUserLeaderboardScreen} />
);

const LandingStackScreen = (
    <Stack.Screen name={Screens.Landing} options={{ headerShown: false }} component={LandingScreen} />
);

const MadeAnAccountStackScreen = (
    <Stack.Screen
        name={Screens.MadeAnAccount}
        options={{ title: 'Your temporary account', headerLeft: () => null }}
        component={MadeAnAccountScreen}
    />
);

const ChooseAPathStackScreen = (
    <Stack.Screen name={Screens.ChooseAPath} options={{ headerShown: false }} component={ChooseAPathScreen} />
);

const ForgotPasswordStackScreen = <Stack.Screen name={Screens.ForgotPassword} component={ForgotPasswordScreen} />;

const LoginStackScreen = <Stack.Screen name={Screens.Login} options={{ headerShown: false }} component={LoginScreen} />;

const UpdatePasswordStackScreen = <Stack.Screen name={Screens.UpdatePassword} component={UpdatePasswordScreen} />;

const SoloStreakStackScreen = (
    <Stack.Screen
        name={Screens.SoloStreaks}
        component={SoloStreaksScreen}
        initialParams={{ isPayingMember: false, totalLiveStreaks: 0, getMultipleLiveSoloStreaksIsLoading: false }}
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

const AddNoteToSoloStreakStackScreen = (
    <Stack.Screen name={Screens.AddNoteToSoloStreak} component={AddNoteToSoloStreakScreen} />
);

const StreakRecommendationsStackScreen = (
    <Stack.Screen
        name={Screens.StreakRecommendations}
        component={StreakRecommendationsScreen}
        options={() => ({
            title: 'Recommendations',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

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

const WhatIsAStreakStackScreen = (
    <Stack.Screen
        name={Screens.WhatIsAStreak}
        options={{ title: 'What is a Streak?', headerLeft: () => null }}
        component={WhatIsAStreakScreen}
    />
);

const WhyDailyStreaksStackScreen = (
    <Stack.Screen
        name={Screens.WhyDailyStreaks}
        options={{ title: 'Why daily streaks?', headerLeft: () => null }}
        component={WhyDailyStreaksScreen}
    />
);

const DifferentTypesOfStreaksStackScreen = (
    <Stack.Screen
        name={Screens.DifferentTypesOfStreaks}
        options={{ title: 'Different types of streaks', headerLeft: () => null }}
        component={DifferentTypesOfStreaksScreen}
    />
);

const StreakRecommendationsIntroStackScreen = (
    <Stack.Screen
        name={Screens.StreakRecommendationsIntro}
        options={{ title: 'Streak Recommendations', headerLeft: () => null }}
        component={StreakRecommendationsIntroScreen}
    />
);

const DailyRemindersStackScreen = (
    <Stack.Screen
        name={Screens.DailyReminders}
        options={{ title: 'Daily Reminders', headerLeft: () => null }}
        component={DailyReminderScreen}
    />
);

const TutorialCompleteStackScreen = (
    <Stack.Screen
        name={Screens.TutorialComplete}
        options={{ title: 'Tutorial Complete', headerLeft: () => null }}
        component={TutorialCompleteScreen}
    />
);

const UpgradeStackScreen = (
    <Stack.Screen
        name={Screens.Upgrade}
        component={UpgradeScreen}
        options={() => ({
            title: 'Upgrade',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

const UsersStackScreen = (
    <Stack.Screen
        name={Screens.Users}
        component={UsersScreen}
        options={() => ({
            title: 'Users',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

const UsersProfileStackScreen = (
    <Stack.Screen
        name={Screens.UserProfile}
        component={UserProfileScreen}
        options={({ route }) => ({
            title: route.params.username,
            headerRight: () =>
                route.params.username ? (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faShareAlt} />}
                        onPress={async () => {
                            await Share.share({
                                message: `View ${route.params.username}'s profile at ${streakoidUrl}/${RouterCategories.users}/${route.params.username}`,
                                url: `${streakoidUrl}/${RouterCategories.users}/${route.params.username}`,
                                title: `View ${route.params.username}'s Streakoid profile`,
                            });
                        }}
                    />
                ) : null,
        })}
    />
);

export const getStackScreens = () => {
    return (
        <>
            {HomeStackScreen}
            {AccountStackScreen}
            {WhyDoYouWantToBuildHabitsStackScreen}
            {WhatIsYourFirstNameStackScreen}
            {WhatIsYourLastNameStackScreen}
            {ChooseAUsernameStackScreen}
            {ChooseAProfilePictureStackScreen}
            {WhatIsYourEmailStackScreen}
            {VerifyEmailStackScreen}
            {ChooseAPasswordStackScreen}
            {CompletedRegistrationStackScreen}
            {CompletedCustomizationStackScreen}
            {FollowingActivityStackScreen}
            {GlobalActivityStackScreen}
            {ChallengesStackScreen}
            {ChallengeInfoStackScreen}
            {ChallengeStreaksStackScreen}
            {ChallengeStreakInfoStackScreen}
            {AddNoteToChallengeStreaksStackScreen}
            {LeaderboardsStackScreen}
            {SoloStreakLeaderboardStackScreen}
            {TeamStreakLeaderboardStackScreen}
            {ChallengeStreakLeaderboardStackScreen}
            {FollowingLeaderboardStackScreen}
            {GlobalUserLeaderboardStackScreen}
            {LandingStackScreen}
            {MadeAnAccountStackScreen}
            {ChooseAPathStackScreen}
            {ForgotPasswordStackScreen}
            {LoginStackScreen}
            {UpdatePasswordStackScreen}
            {SoloStreakStackScreen}
            {SoloStreakInfoStackScreen}
            {CreateSoloStreakStackScreen}
            {EditSoloStreakStackScreen}
            {AddNoteToSoloStreakStackScreen}
            {StreakRecommendationsStackScreen}
            {TeamStreaksStackScreen}
            {TeamStreakInfoStackScreen}
            {CreateTeamTeamStreakStackScreen}
            {EditTeamTeamStreakStackScreen}
            {AddFollowerToTeamTeamStreakStackScreen}
            {TeamMemberStreakInfoStackScreen}
            {AddNoteToTeamTeamStreakStackScreen}
            {WhatIsAStreakStackScreen}
            {WhyDailyStreaksStackScreen}
            {DifferentTypesOfStreaksStackScreen}
            {StreakRecommendationsIntroStackScreen}
            {DailyRemindersStackScreen}
            {TutorialCompleteStackScreen}
            {UpgradeStackScreen}
            {UsersStackScreen}
            {UsersProfileStackScreen}
        </>
    );
};

export const streakStack = () => <Stack.Navigator initialRouteName={Screens.Home}>{getStackScreens()}</Stack.Navigator>;
export const challengeStreakStack = () => (
    <Stack.Navigator initialRouteName={Screens.ChallengeStreaks}>{getStackScreens()}</Stack.Navigator>
);
export const teamStreakStack = () => (
    <Stack.Navigator initialRouteName={Screens.TeamStreaks}>{getStackScreens()}</Stack.Navigator>
);
export const soloStreakStack = () => (
    <Stack.Navigator initialRouteName={Screens.SoloStreaks}>{getStackScreens()}</Stack.Navigator>
);
export const challengeStack = () => (
    <Stack.Navigator initialRouteName={Screens.Challenges}>{getStackScreens()}</Stack.Navigator>
);
export const leaderboardsStack = () => (
    <Stack.Navigator initialRouteName={Screens.Leaderboards}>{getStackScreens()}</Stack.Navigator>
);
export const streakRecommendationsStack = () => (
    <Stack.Navigator initialRouteName={Screens.StreakRecommendations}>{getStackScreens()}</Stack.Navigator>
);
export const usersStack = () => <Stack.Navigator initialRouteName={Screens.Users}>{getStackScreens()}</Stack.Navigator>;
export const accountStack = () => (
    <Stack.Navigator initialRouteName={Screens.Account}>{getStackScreens()}</Stack.Navigator>
);
export const upgradeStack = () => (
    <Stack.Navigator initialRouteName={Screens.Upgrade}>{getStackScreens()}</Stack.Navigator>
);
export const landingStack = () => (
    <Stack.Navigator initialRouteName={Screens.Landing}>{getStackScreens()}</Stack.Navigator>
);
export const followingActivityFeedStack = () => (
    <Stack.Navigator initialRouteName={Screens.FollowingActivity}>{getStackScreens()}</Stack.Navigator>
);
export const globalActivityFeedStack = () => (
    <Stack.Navigator initialRouteName={Screens.GlobalActivity}>{getStackScreens()}</Stack.Navigator>
);
