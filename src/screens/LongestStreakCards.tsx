import React, { PureComponent } from 'react';

import { LongestCurrentStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentStreak';
import { LongestEverStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverStreak';

import { LongestEverStreakCard } from './LongestEverStreakCard';
import { LongestCurrentStreakCard } from './LongestCurrentStreakCard';
import { LongestSoloStreakCard } from './LongestSoloStreakCard';
import { LongestChallengeStreakCard } from './LongestChallengeStreakCard';
import { LongestTeamMemberStreakCard } from './LongestTeamMemberStreakCard';
import { LongestTeamStreakCard } from './LongestTeamStreakCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { LongestEverSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverSoloStreak';
import { LongestEverChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverChallengeStreak';
import { LongestEverTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverTeamMemberStreak';
import { LongestEverTeamStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverTeamStreak';

interface LongestStreakCardsProps {
    navigation: StackNavigationProp<RootStackParamList>;
    longestEverStreak: LongestEverStreak;
    longestCurrentStreak: LongestCurrentStreak;
    longestSoloStreak: LongestEverSoloStreak;
    longestChallengeStreak: LongestEverChallengeStreak;
    longestTeamMemberStreak: LongestEverTeamMemberStreak;
    longestTeamStreak: LongestEverTeamStreak;
    isUsersSoloStreak: boolean;
    userIsApartOfTeamStreak: boolean;
}

class LongestStreakCards extends PureComponent<LongestStreakCardsProps> {
    render() {
        const {
            longestEverStreak,
            longestCurrentStreak,
            longestSoloStreak,
            longestChallengeStreak,
            longestTeamMemberStreak,
            longestTeamStreak,
            isUsersSoloStreak,
            userIsApartOfTeamStreak,
        } = this.props;
        return (
            <>
                <LongestEverStreakCard navigation={this.props.navigation} longestEverStreak={longestEverStreak} />
                <LongestCurrentStreakCard
                    navigation={this.props.navigation}
                    longestCurrentStreak={longestCurrentStreak}
                />
                <LongestSoloStreakCard
                    navigation={this.props.navigation}
                    soloStreakId={longestSoloStreak && longestSoloStreak.soloStreakId}
                    soloStreakName={longestSoloStreak && longestSoloStreak.soloStreakName}
                    numberOfDays={longestSoloStreak && longestSoloStreak.numberOfDays}
                    startDate={
                        longestSoloStreak && longestSoloStreak.startDate && longestSoloStreak.startDate.toString()
                    }
                    endDate={longestSoloStreak && longestSoloStreak.endDate && longestSoloStreak.endDate.toString()}
                    isUsersStreak={isUsersSoloStreak}
                />
                <LongestChallengeStreakCard
                    navigation={this.props.navigation}
                    challengeStreakId={longestChallengeStreak && longestChallengeStreak.challengeStreakId}
                    challengeName={longestChallengeStreak && longestChallengeStreak.challengeName}
                    numberOfDays={longestChallengeStreak && longestChallengeStreak.numberOfDays}
                    startDate={
                        longestChallengeStreak &&
                        longestChallengeStreak.startDate &&
                        longestChallengeStreak.startDate.toString()
                    }
                    endDate={
                        longestChallengeStreak &&
                        longestChallengeStreak.endDate &&
                        longestChallengeStreak.endDate.toString()
                    }
                />
                <LongestTeamMemberStreakCard
                    navigation={this.props.navigation}
                    teamMemberStreakId={longestTeamMemberStreak && longestTeamMemberStreak.teamMemberStreakId}
                    teamStreakName={longestTeamMemberStreak && longestTeamMemberStreak.teamStreakName}
                    numberOfDays={longestTeamMemberStreak && longestTeamMemberStreak.numberOfDays}
                    startDate={
                        longestTeamMemberStreak &&
                        longestTeamMemberStreak.startDate &&
                        longestTeamMemberStreak.startDate.toString()
                    }
                    endDate={
                        longestTeamMemberStreak &&
                        longestTeamMemberStreak.endDate &&
                        longestTeamMemberStreak.endDate.toString()
                    }
                />
                <LongestTeamStreakCard
                    navigation={this.props.navigation}
                    teamStreakId={longestTeamStreak && longestTeamStreak.teamStreakId}
                    teamStreakName={longestTeamStreak && longestTeamStreak.teamStreakName}
                    numberOfDays={longestTeamStreak && longestTeamStreak.numberOfDays}
                    userIsApartOfTeamStreak={userIsApartOfTeamStreak}
                    startDate={
                        longestTeamStreak && longestTeamStreak.startDate && longestTeamStreak.startDate.toString()
                    }
                    endDate={longestTeamStreak && longestTeamStreak.endDate && longestTeamStreak.endDate.toString()}
                />
            </>
        );
    }
}

export { LongestStreakCards };
