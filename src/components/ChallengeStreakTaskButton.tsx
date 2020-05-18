import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/pro-light-svg-icons';
import { Vibration } from 'react-native';
import { streakoidAnalytics } from '../../streakoidAnalytics';

interface ChallengeStreakTaskButtonProps {
    completeChallengeStreakListTask: (streakId: string) => void;
    incompleteChallengeStreakListTask: (streakId: string) => void;
    challengeStreakId: string;
    challengeId: string;
    challengeName: string;
    currentStreakNumberOfDaysInARow: number;
    completedToday: boolean;
    incompleteChallengeStreakListTaskIsLoading: boolean;
    completeChallengeStreakListTaskIsLoading: boolean;
}

class ChallengeStreakTaskButton extends PureComponent<ChallengeStreakTaskButtonProps> {
    render(): JSX.Element {
        const {
            completeChallengeStreakListTask,
            incompleteChallengeStreakListTask,
            challengeStreakId,
            challengeId,
            challengeName,
            currentStreakNumberOfDaysInARow,
            completedToday,
            completeChallengeStreakListTaskIsLoading,
            incompleteChallengeStreakListTaskIsLoading,
        } = this.props;

        const button = completedToday ? (
            <Button
                type="clear"
                buttonStyle={{ borderRadius: 50 }}
                icon={<FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} size={25} />}
                loading={incompleteChallengeStreakListTaskIsLoading}
                onPress={(): void => {
                    Vibration.vibrate(200);
                    incompleteChallengeStreakListTask(challengeStreakId);
                }}
            />
        ) : (
            <Button
                type="clear"
                buttonStyle={{ borderRadius: 50 }}
                icon={<FontAwesomeIcon icon={faCircle} size={25} />}
                loading={completeChallengeStreakListTaskIsLoading}
                onPress={(): void => {
                    streakoidAnalytics.completedChallengeStreak({
                        challengeStreakId,
                        challengeId,
                        challengeName,
                        currentStreakNumberOfDaysInARow,
                    });
                    Vibration.vibrate(200);
                    completeChallengeStreakListTask(challengeStreakId);
                }}
            />
        );
        return button;
    }
}

export { ChallengeStreakTaskButton };
