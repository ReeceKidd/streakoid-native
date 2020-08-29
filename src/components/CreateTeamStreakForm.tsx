import React, { PureComponent } from 'react';
import { Formik, FormikErrors } from 'formik';
import { View } from 'react-native';
import { Spacer } from './Spacer';
import { Input, Button } from 'react-native-elements';
import { ErrorMessage } from './ErrorMessage';
import { teamStreakActions } from '../actions/authenticatedSharedActions';
import { streakoidAnalytics } from '../../streakoidAnalytics';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';

interface CreateTeamStreakFormProps {
    createTeamStreak: typeof teamStreakActions.createTeamStreak;
    createTeamStreakErrorMessage: string;
    createTeamStreakIsLoading: boolean;
    navigation: StackNavigationProp<RootStackParamList, Screens.CreateTeamStreak>;
}

interface FormValues {
    streakName: string;
}

type Props = CreateTeamStreakFormProps;

const validate = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    const { streakName } = values;
    if (!streakName) {
        errors.streakName = 'You must enter a streak name';
    }

    return errors;
};

class CreateTeamStreakForm extends PureComponent<Props> {
    onSubmit = ({ streakName }: { streakName: string }): void => {
        this.props.createTeamStreak({
            streakName,
        });
    };

    render(): JSX.Element {
        const { createTeamStreakIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ streakName: '', streakDescription: '', streakDuration: '' }}
                onSubmit={(values: FormValues): void => {
                    streakoidAnalytics.createdTeamStreak({ teamStreakName: values.streakName });
                    this.onSubmit(values);
                }}
                validate={validate}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Streak name"
                                nativeID="streakName"
                                onChangeText={handleChange('streakName')}
                                onBlur={handleBlur('streakName')}
                                value={values.streakName}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.streakName && touched.streakName ? (
                                <ErrorMessage message={errors.streakName} />
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button
                                loading={createTeamStreakIsLoading}
                                onPress={submitForm}
                                title="Create Team Streak"
                            />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { CreateTeamStreakForm };
