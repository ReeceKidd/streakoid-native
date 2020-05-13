import React from 'react';
import * as Sentry from '@sentry/browser';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

export class ErrorBoundary extends React.Component<{ children: unknown }> {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidMount() {
        Sentry.init({
            dsn: 'https://db870b837637476b9962d45ba8e6cc23@o387464.ingest.sentry.io/5222763',
        });
    }

    componentDidCatch(error: Error) {
        Sentry.captureException(error);
        Alert.alert(
            'Unexpected error',
            'This error has been forward to the developer. Please restart to continue.',
            [
                {
                    text: 'Restart App',
                    onPress: () => RNRestart.Restart(),
                },
            ],
            { cancelable: false },
        );
    }
    render() {
        return this.state.hasError ? null : this.props.children;
    }
}
