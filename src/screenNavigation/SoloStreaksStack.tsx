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

export type SoloStreakStackParamsList = {
    SoloStreaks: { isPayingMember: boolean; totalLiveStreaks: number; getMultipleLiveSoloStreaksIsLoading: boolean };
    SoloStreakInfo: { _id: string; streakName: string; isUsersStreak: boolean };
    CreateSoloStreak: undefined;
    EditSoloStreak: undefined;
};

const Stack = createStackNavigator<SoloStreakStackParamsList>();

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

const SoloStreaksStack = () => (
    <Stack.Navigator>
        {SoloStreakStackScreen}
        {SoloStreakInfoStackScreen}
        {CreateSoloStreakStackScreen}
        {EditSoloStreakStackScreen}
    </Stack.Navigator>
);

export { SoloStreaksStack };
