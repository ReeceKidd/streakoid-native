import React from 'react';
import juration from 'juration';
import { Formik, FormikErrors } from 'formik';
import { View } from 'react-native';
import { Spacer } from './Spacer';
import { Input, Button, Text } from 'react-native-elements';
import { ErrorMessage } from './ErrorMessage';
import { teamStreakActions, userActions } from '../actions/sharedActions';
import { FollowerSelector } from './FollowerSelector';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Platform } from 'react-native';
import { FollowerWithClientData } from '@streakoid/streakoid-shared/lib/reducers/userReducer';

interface CreateTeamStreakFormProps {
    createTeamStreak: typeof teamStreakActions.createTeamStreak;
    selectFollower: typeof userActions.selectFollower;
    unselectFollower: typeof userActions.unselectFollower;
    followers: FollowerWithClientData[];
    members: { memberId: string }[];
    createTeamStreakErrorMessage: string;
    createTeamStreakIsLoading: boolean;
}

interface FormValues {
    streakName: string;
    streakDescription?: string;
    streakDuration?: string;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = CreateTeamStreakFormProps & NavigationProps;

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

class CreateTeamStreakForm extends React.PureComponent<Props> {
    onSubmit = ({
        streakName,
        streakDescription,
        streakDuration,
    }: {
        streakName: string;
        streakDescription?: string;
        streakDuration?: string;
    }): void => {
        const { members } = this.props;
        const convertedNaturalLanguageTimeSeconds = (streakDuration && juration.parse(streakDuration)) || undefined;
        const numberOfMinutes =
            convertedNaturalLanguageTimeSeconds && convertedNaturalLanguageTimeSeconds > 0
                ? convertedNaturalLanguageTimeSeconds / 60
                : undefined;
        this.props.createTeamStreak({
            streakName,
            members,
            streakDescription: streakDescription !== '' ? streakDescription : undefined,
            numberOfMinutes,
            isAppleDevice: Platform.OS === 'ios',
        });
    };

    render(): JSX.Element {
        const { selectFollower, unselectFollower, followers, createTeamStreakIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ streakName: '', streakDescription: '', streakDuration: '' }}
                onSubmit={(values: FormValues): void => {
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
                            <Text style={{ fontWeight: 'bold' }}> Add followers </Text>
                            <FollowerSelector
                                selectFollower={selectFollower}
                                unselectFollower={unselectFollower}
                                followers={followers}
                                navigation={this.props.navigation}
                            />
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
