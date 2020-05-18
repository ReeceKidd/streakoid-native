import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/pro-light-svg-icons';
import { Vibration } from 'react-native';
import { streakoidAnalytics } from '../../streakoidAnalytics';

interface SoloStreakTaskButtonProps {
    completeSoloStreakListTask: (streakId: string) => void;
    incompleteSoloStreakListTask: (streakId: string) => void;
    soloStreakId: string;
    soloStreakName: string;
    currentStreakNumberOfDaysInARow: number;
    completedToday: boolean;
    incompleteSoloStreakListTaskIsLoading: boolean;
    completeSoloStreakListTaskIsLoading: boolean;
}

class SoloStreakTaskButton extends PureComponent<SoloStreakTaskButtonProps> {
    render(): JSX.Element {
        const {
            completeSoloStreakListTask,
            incompleteSoloStreakListTask,
            soloStreakId,
            soloStreakName,
            currentStreakNumberOfDaysInARow,
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
                    incompleteSoloStreakListTask(soloStreakId);
                }}
            />
        ) : (
            <Button
                type="clear"
                buttonStyle={{ borderRadius: 50 }}
                icon={<FontAwesomeIcon icon={faCircle} size={25} />}
                loading={completeSoloStreakListTaskIsLoading}
                onPress={(): void => {
                    streakoidAnalytics.completedSoloStreak({
                        soloStreakId,
                        soloStreakName,
                        currentStreakNumberOfDaysInARow,
                    });
                    Vibration.vibrate(200);
                    completeSoloStreakListTask(soloStreakId);
                }}
            />
        );
        return button;
    }
}

export { SoloStreakTaskButton };
