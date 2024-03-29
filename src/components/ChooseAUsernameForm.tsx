/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { authActions } from '../actions/authActions';

interface FormValues {
    username: string;
}

interface ChooseAUsernameFormProps {
    updateUsernameAttribute: typeof authActions.updateUsernameAttribute;
    updateUsernameAttributeIsLoading: boolean;
    updateUsernameAttributeErrorMessage: string;
    currentUsername: string | undefined;
}

const ChooseAUsernameFormSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
    },
});

class ChooseAUsernameForm extends PureComponent<ChooseAUsernameFormProps> {
    render(): JSX.Element {
        const { updateUsernameAttributeIsLoading, updateUsernameAttributeErrorMessage, currentUsername } = this.props;
        return (
            <Formik
                initialValues={{ username: currentUsername || '', email: '', password: '' }}
                onSubmit={({ username }: FormValues): void => {
                    this.props.updateUsernameAttribute({ username, navigateToChooseAProfilePicture: true });
                }}
                validationSchema={ChooseAUsernameFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Choose a username"
                                nativeID="username"
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                                autoCapitalize="none"
                                autoCompleteType="username"
                                autoCorrect={false}
                            />
                            <Spacer />
                            {errors.username && touched.username ? (
                                <Text style={styles.errorMessage}>{errors.username}</Text>
                            ) : null}
                            {updateUsernameAttributeErrorMessage && touched.username ? (
                                <Text style={styles.errorMessage}>{updateUsernameAttributeErrorMessage}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={updateUsernameAttributeIsLoading} onPress={submitForm} title="Next" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { ChooseAUsernameForm };
