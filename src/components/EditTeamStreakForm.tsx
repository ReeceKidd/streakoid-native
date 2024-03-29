import React, { PureComponent } from 'react';
import juration from 'juration';
import { Formik, FormikErrors } from 'formik';
import { View } from 'react-native';
import { Spacer } from './Spacer';
import { Input, Button } from 'react-native-elements';
import { ErrorMessage } from './ErrorMessage';

interface EditTeamStreakFormProps {
    editTeamStreak: ({
        teamStreakId,
        streakName,
        streakDescription,
        numberOfMinutes,
    }: {
        teamStreakId: string;
        streakName: string;
        streakDescription?: string;
        numberOfMinutes?: number;
    }) => void;
    clearMessages: () => void;
    teamStreakId: string;
    streakName: string;
    editTeamStreakIsLoading: boolean;
    editTeamStreakErrorMessage: string;
    streakDescription?: string;
    numberOfMinutes?: number;
}

interface FormValues {
    streakName: string;
    streakDescription?: string;
    streakDuration?: string;
}

type Props = EditTeamStreakFormProps;

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

class EditTeamStreakForm extends PureComponent<Props> {
    onSubmit = ({
        teamStreakId,
        streakName,
        streakDescription,
        streakDuration,
    }: {
        teamStreakId: string;
        streakName: string;
        streakDescription?: string;
        streakDuration?: string;
    }): void => {
        const numberOfSeconds = (streakDuration && juration.parse(streakDuration)) || undefined;
        const numberOfMinutes = numberOfSeconds && numberOfSeconds > 0 ? numberOfSeconds / 60 : undefined;
        return this.props.editTeamStreak({
            teamStreakId,
            streakName,
            streakDescription: streakDescription !== '' ? streakDescription : undefined,
            numberOfMinutes,
        });
    };

    render(): JSX.Element {
        const { teamStreakId, streakName, streakDescription, numberOfMinutes, editTeamStreakIsLoading } = this.props;
        const numberOfSeconds = numberOfMinutes && numberOfMinutes * 60;
        const streakDuration =
            (numberOfSeconds && juration.stringify(numberOfSeconds, { format: 'long' })) || undefined;
        return (
            <Formik
                initialValues={{ streakName, streakDescription, streakDuration }}
                onSubmit={(values: FormValues): void => {
                    this.onSubmit({ ...values, teamStreakId });
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
                            <Button loading={editTeamStreakIsLoading} onPress={submitForm} title="Edit Team Streak" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { EditTeamStreakForm };
