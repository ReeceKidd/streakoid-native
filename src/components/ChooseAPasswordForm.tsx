/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { authActions } from '../actions/authActions';

interface ChooseAPasswordFormProps {
    updateUserPassword: typeof authActions.updateUserPassword;
    oldPassword: string;
}

interface FormValues {
    password: string;
}

const ChooseAPasswordFormSchema = Yup.object().shape({
    password: Yup.string().required('Required').min(8),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

class ChooseAPasswordForm extends PureComponent<ChooseAPasswordFormProps> {
    render(): JSX.Element {
        return (
            <Formik
                initialValues={{ password: '' }}
                onSubmit={({ password }: FormValues): void => {
                    this.props.updateUserPassword({
                        newPassword: password,
                        oldPassword: this.props.oldPassword,
                    });
                }}
                validationSchema={ChooseAPasswordFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Choose your password"
                                nativeID="password"
                                secureTextEntry={true}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                autoCapitalize="none"
                                autoCompleteType="password"
                                autoCorrect={false}
                                onSubmitEditing={submitForm}
                            />
                            {errors.password && touched.password ? (
                                <Text style={styles.errorMessage}>{errors.password}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button onPress={submitForm} title="Submit" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { ChooseAPasswordForm };
