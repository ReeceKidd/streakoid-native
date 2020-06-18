import React from 'react';

import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { ProgressBar } from './ProgressBar';
import { Spacer } from './Spacer';
import { getRegistrationCompletionPercentage } from '@streakoid/streakoid-shared/lib/helpers/progress/getRegistrationCompletionPercentage';

interface RegistrationProgressBarProps {
    currentUser: PopulatedCurrentUser;
}

class RegistrationProgressBar extends React.PureComponent<RegistrationProgressBarProps> {
    render(): JSX.Element {
        const { currentUser } = this.props;
        return (
            <>
                <Spacer>
                    <ProgressBar
                        fullScreen={false}
                        completePercentage={getRegistrationCompletionPercentage({ currentUser })}
                    />
                </Spacer>
            </>
        );
    }
}

export { RegistrationProgressBar };
