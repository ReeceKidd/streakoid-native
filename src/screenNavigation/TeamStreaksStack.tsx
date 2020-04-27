import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { TeamStreaksScreen } from '../screens/TeamStreaksScreen';
import { TeamStreakInfoScreen } from '../screens/TeamStreakInfoScreen';
import { CreateTeamStreakScreen } from '../screens/CreateTeamStreakScreen';
import { EditTeamStreakScreen } from '../screens/EditTeamStreakScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPeopleCarry } from '@fortawesome/pro-solid-svg-icons';
import { AddFollowerToTeamStreakScreen } from '../screens/AddFollowerToTeamStreakScreen';
import { AddNoteToTeamStreakScreen } from '../screens/AddNoteToTeamStreakScreen';
import { TeamMemberStreakInfoScreen } from '../screens/TeamMemberStreakScreen';

const TeamStreakStack = createStackNavigator(
    {
        TeamStreaks: TeamStreaksScreen,
        TeamStreakInfo: TeamStreakInfoScreen,
        CreateTeamStreak: CreateTeamStreakScreen,
        EditTeamStreak: EditTeamStreakScreen,
        AddFollowerToTeamStreak: AddFollowerToTeamStreakScreen,
        AddNoteToTeamStreak: AddNoteToTeamStreakScreen,
        TeamMemberStreakInfo: TeamMemberStreakInfoScreen,
    },
    {
        navigationOptions: {
            title: 'Team Streaks',
            tabBarIcon: <FontAwesomeIcon icon={faPeopleCarry} size={20} />,
        },
    },
);

export { TeamStreakStack };
