import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { Vibration } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/pro-light-svg-icons';

interface TeamStreakTaskButtonProps {
    completeTeamMemberStreakTask: ({
        teamStreakId,
        teamMemberStreakId,
    }: {
        teamStreakId: string;
        teamMemberStreakId: string;
    }) => void;
    incompleteTeamMemberStreakTask: ({
        teamStreakId,
        teamMemberStreakId,
    }: {
        teamStreakId: string;
        teamMemberStreakId: string;
    }) => void;
    teamStreakId: string;
    completedToday: boolean;
    incompleteTeamMemberStreakTaskIsLoading: boolean;
    completeTeamMemberStreakTaskIsLoading: boolean;
    teamMemberStreakId: string;
}

class TeamMemberStreakTaskButton extends PureComponent<TeamStreakTaskButtonProps> {
    render(): JSX.Element {
        const {
            completeTeamMemberStreakTask,
            incompleteTeamMemberStreakTask,
            teamStreakId,
            teamMemberStreakId,
            completedToday,
            completeTeamMemberStreakTaskIsLoading,
            incompleteTeamMemberStreakTaskIsLoading,
        } = this.props;

        const button = completedToday ? (
            <Button
                type="clear"
                buttonStyle={{ borderRadius: 50 }}
                icon={<FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} size={25} />}
                loading={incompleteTeamMemberStreakTaskIsLoading}
                onPress={(): void => {
                    Vibration.vibrate(200);
                    incompleteTeamMemberStreakTask({ teamStreakId, teamMemberStreakId });
                }}
            />
        ) : (
            <Button
                type="clear"
                buttonStyle={{ borderRadius: 50 }}
                icon={<FontAwesomeIcon icon={faCircle} size={25} />}
                loading={completeTeamMemberStreakTaskIsLoading}
                onPress={(): void => {
                    Vibration.vibrate(200);
                    completeTeamMemberStreakTask({ teamStreakId, teamMemberStreakId });
                }}
            />
        );
        return button;
    }
}

export { TeamMemberStreakTaskButton };
