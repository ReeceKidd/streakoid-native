import React from 'react';

import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { ProgressBar } from './ProgressBar';
import { Spacer } from './Spacer';
import { getAccountCompletionPercentage } from '@streakoid/streakoid-shared/lib/helpers/progress/getAccountCompletionPercentage';

interface AccountStrengthProgressBarProps {
    currentUser: PopulatedCurrentUser;
}

class AccountStrengthProgressBar extends React.PureComponent<AccountStrengthProgressBarProps> {
    render(): JSX.Element {
        const { currentUser } = this.props;
        return (
            <>
                <Spacer>
                    <ProgressBar
                        fullScreen={false}
                        completePercentage={getAccountCompletionPercentage({ currentUser })}
                    />
                </Spacer>
            </>
        );
    }
}

export { AccountStrengthProgressBar };
