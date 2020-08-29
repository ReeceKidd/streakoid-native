import React, { PureComponent } from 'react';
import { Formik, FormikErrors } from 'formik';
import { View } from 'react-native';
import { Spacer } from './Spacer';
import { Input, Button } from 'react-native-elements';
import { ErrorMessage } from './ErrorMessage';
import { soloStreakActions } from '../actions/authenticatedSharedActions';
import { streakoidAnalytics } from '../../streakoidAnalytics';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

interface CreateSoloStreakFormProps {
    createSoloStreak: typeof soloStreakActions.createSoloStreak;
    createSoloStreakIsLoading: boolean;
    createSoloStreakErrorMessage: string;
    navigation: StackNavigationProp<RootStackParamList, Screens.CreateSoloStreak>;
}

interface FormValues {
    streakName: string;
}

type Props = CreateSoloStreakFormProps;

const validate = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    const { streakName } = values;
    if (!streakName) {
        errors.streakName = 'You must enter a streak name';
    }

    return errors;
};

class CreateSoloStreakForm extends PureComponent<Props> {
    onSubmit = ({ streakName }: { streakName: string }) => {
        this.props.createSoloStreak({
            streakName,
        });
        this.props.navigation.pop();
    };

    render(): JSX.Element {
        const { createSoloStreakIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ streakName: '', streakDescription: '', streakDuration: '' }}
                onSubmit={(values: FormValues): void => {
                    streakoidAnalytics.createdSoloStreak({ soloStreakName: values.streakName });
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
                                loading={createSoloStreakIsLoading}
                                onPress={submitForm}
                                title="Create Solo Streak"
                            />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { CreateSoloStreakForm };
