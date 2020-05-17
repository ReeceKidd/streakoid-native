import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface Props {
    whatsappGroupLink: string;
    challengeName: string;
}

class WhatsappGroupLink extends PureComponent<Props> {
    render(): JSX.Element {
        const { whatsappGroupLink, challengeName } = this.props;
        return (
            <Button
                buttonStyle={{ backgroundColor: 'green' }}
                title={` ${challengeName}`}
                icon={<FontAwesomeIcon icon={faWhatsapp} color="white" />}
                onPress={() => {
                    Linking.openURL(whatsappGroupLink);
                }}
            ></Button>
        );
    }
}

export { WhatsappGroupLink };
