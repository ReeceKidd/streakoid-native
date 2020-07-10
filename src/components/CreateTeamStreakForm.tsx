import React, { PureComponent } from 'react';
import juration from 'juration';
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
    streakDescription?: string;
    streakDuration?: string;
}

type Props = CreateTeamStreakFormProps;

const validate = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    const { streakName, streakDuration } = values;
    if (!streakName) {
        errors.streakName = 'You must enter a streak name';
    }
    if (streakDuration) {
        try {
            const numberOfSeconds = juration.parse(streakDuration);
            if (numberOfSeconds <= 0) {
                errors.streakDuration = 'Duration cannot be less than or equal to zero';
            }
        } catch (err) {
            errors.streakDuration = 'Enter a valid duration like 30 minutes';
        }

        if (Number(streakDuration)) {
            errors.streakDuration = 'Specify seconds, minutes or hours';
        }
    }

    return errors;
};

class CreateTeamStreakForm extends PureComponent<Props> {
    onSubmit = ({
        streakName,
        streakDescription,
        streakDuration,
    }: {
        streakName: string;
        streakDescription?: string;
        streakDuration?: string;
    }): void => {
        const convertedNaturalLanguageTimeSeconds = (streakDuration && juration.parse(streakDuration)) || undefined;
        const numberOfMinutes =
            convertedNaturalLanguageTimeSeconds && convertedNaturalLanguageTimeSeconds > 0
                ? convertedNaturalLanguageTimeSeconds / 60
                : undefined;
        this.props.createTeamStreak({
            streakName,
            members: [],
            streakDescription: streakDescription !== '' ? streakDescription : undefined,
            numberOfMinutes,
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
                            <Input
                                label="Streak description"
                                nativeID="streakDescription"
                                onChangeText={handleChange('streakDescription')}
                                onBlur={handleBlur('streakDescription')}
                                value={values.streakDescription}
                                autoCapitalize="none"
                                autoCorrect={false}
                                multiline={true}
                            />
                            {errors.streakDescription && touched.streakDescription ? (
                                <ErrorMessage message={errors.streakDescription} />
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Input
                                label="How long will you do this for everyday?"
                                nativeID="streakDuration"
                                placeholder="30 minutes"
                                onChangeText={handleChange('streakDuration')}
                                onBlur={handleBlur('streakDuration')}
                                value={values.streakDuration}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.streakDuration && touched.streakDuration ? (
                                <ErrorMessage message={errors.streakDuration} />
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
