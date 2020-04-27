import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/pro-light-svg-icons';
import { Vibration } from 'react-native';

interface ChallengeStreakTaskButtonProps {
    completeChallengeStreakListTask: (streakId: string) => void;
    incompleteChallengeStreakListTask: (streakId: string) => void;
    streakId: string;
    completedToday: boolean;
    incompleteChallengeStreakListTaskIsLoading: boolean;
    completeChallengeStreakListTaskIsLoading: boolean;
}

class ChallengeStreakTaskButton extends Component<ChallengeStreakTaskButtonProps> {
    render(): JSX.Element {
        const {
            completeChallengeStreakListTask,
            incompleteChallengeStreakListTask,
            streakId,
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
                    incompleteChallengeStreakListTask(streakId);
                }}
            />
        ) : (
            <Button
                type="clear"
                buttonStyle={{ borderRadius: 50 }}
                icon={<FontAwesomeIcon icon={faCircle} size={25} />}
                loading={completeChallengeStreakListTaskIsLoading}
                onPress={(): void => {
                    Vibration.vibrate(200);
                    completeChallengeStreakListTask(streakId);
                }}
            />
        );
        return button;
    }
}

export { ChallengeStreakTaskButton };
