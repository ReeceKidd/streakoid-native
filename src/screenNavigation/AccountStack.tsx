/* eslint-disable react/display-name */
import React from 'react';
import { AccountScreen } from '../screens/AccountScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { Share } from 'react-native';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShareAlt } from '@fortawesome/pro-solid-svg-icons';
import { streakoidUrl } from '../streakoidUrl';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { WhatIsYourFirstNameScreen } from '../screens/accountCreation.tsx/WhatIsYourFirstNameScreen';
import { WhyDoYouWantToBuildHabitsScreen } from '../screens/accountCreation.tsx/WhyDoYouWantToBuildHabits';
import { WhatIsYourLastNameScreen } from '../screens/accountCreation.tsx/WhatIsYourLastNameScreen';
import { ChooseAUsernameScreen } from '../screens/accountCreation.tsx/ChooseAUsernameScreen';
import { ChooseAProfilePictureScreen } from '../screens/accountCreation.tsx/ChooseAProfilePictureScreen';
import { WhatIsYourEmailScreen } from '../screens/registration/WhatIsYourEmailScreen';
import { VerifyEmailScreen } from '../screens/registration/VerifyEmailScreen';
import { CompletedRegistrationScreen } from '../screens/registration/CompletedRegistrationScreen';
import { ChooseAPasswordScreen } from '../screens/registration/ChooseAPasswordScreen';
import { CompletedCustomizationScreen } from '../screens/accountCreation.tsx/CompletedCustomizationScreen';
import { UsersProfileStackScreen } from './UserStack';

export type AccountStackParamList = {
    Account: { username: string };
    WhyDoYouWantToBuildHabits: undefined;
    WhatIsYourFirstName: undefined;
    WhatIsYourLastName: undefined;
    ChooseAUsername: undefined;
    ChooseAProfilePicture: undefined;
    WhatIsYourEmail: undefined;
    VerifyEmail: undefined;
    ChooseAPassword: undefined;
    CompletedRegistration: undefined;
    CompletedCustomization: undefined;
    UserProfile: { _id: string; username: string };
};

const Stack = createStackNavigator<AccountStackParamList>();

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

const AccountStack = () => (
    <Stack.Navigator>
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
        {UsersProfileStackScreen}
    </Stack.Navigator>
);

export { AccountStack };
