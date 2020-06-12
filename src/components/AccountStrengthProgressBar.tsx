import React from 'react';

import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { faUserCrown } from '@fortawesome/pro-solid-svg-icons';
import { Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ProgressBar } from './ProgressBar';
import { Spacer } from './Spacer';
import { getAccountCompletionPercentage } from '../helpers/getAccountCompletionPercentage';

interface AccountStrengthProgressBarProps {
    currentUser: PopulatedCurrentUser;
}

class AccountStrengthProgressBar extends React.PureComponent<AccountStrengthProgressBarProps> {
    render(): JSX.Element {
        const { currentUser } = this.props;
        return (
            <>
                <Spacer>
                    <Text style={{ fontWeight: 'bold' }}>
                        {`Account strength`} <FontAwesomeIcon icon={faUserCrown} />
                    </Text>
                    <Spacer />
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
