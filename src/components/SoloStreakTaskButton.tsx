import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/pro-solid-svg-icons';
import { Vibration } from 'react-native';

interface SoloStreakTaskButtonProps {
    completeSoloStreakListTask: (streakId: string) => void;
    incompleteSoloStreakListTask: (streakId: string) => void;
    streakId: string;
    completedToday: boolean;
    incompleteSoloStreakListTaskIsLoading: boolean;
    completeSoloStreakListTaskIsLoading: boolean;
}

class SoloStreakTaskButton extends Component<SoloStreakTaskButtonProps> {
    render(): JSX.Element {
        const {
            completeSoloStreakListTask,
            incompleteSoloStreakListTask,
            streakId,
            completedToday,
            completeSoloStreakListTaskIsLoading,
            incompleteSoloStreakListTaskIsLoading,
        } = this.props;

        const button = completedToday ? (
            <Button
                type="clear"
                buttonStyle={{ borderRadius: 50 }}
                icon={<FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} size={25} />}
                loading={incompleteSoloStreakListTaskIsLoading}
                onPress={(): void => {
                    Vibration.vibrate(200);
                    incompleteSoloStreakListTask(streakId);
                }}
            />
        ) : (
            <Button
                type="clear"
                buttonStyle={{ borderRadius: 50 }}
                icon={<FontAwesomeIcon icon={faCircle} size={25} />}
                loading={completeSoloStreakListTaskIsLoading}
                onPress={(): void => {
                    Vibration.vibrate(200);
                    completeSoloStreakListTask(streakId);
                }}
            />
        );
        return button;
    }
}

export { SoloStreakTaskButton };
