/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PureComponent } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { View, StyleSheet } from 'react-native';
import { Spacer } from './Spacer';
import { Input, Text, Button } from 'react-native-elements';

interface UpdatePasswordFormProps {
    updatePassword: (username: string, code: string, newPassword: string) => void;
    updatePasswordIsLoading: boolean;
    username: string;
}

interface FormValues {
    verificationCode: string;
    newPassword: string;
}

const UpdatePasswordFormSchema = Yup.object().shape({
    verificationCode: Yup.string().required('Required'),
    newPassword: Yup.string().min(8, 'Password must be at least eight characters').required('Required'),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

class UpdatePasswordForm extends PureComponent<UpdatePasswordFormProps> {
    onSubmit = (formValues: FormValues): void => {
        const { username } = this.props;
        const { verificationCode, newPassword } = formValues;
        this.props.updatePassword(username, verificationCode, newPassword);
    };

    render(): JSX.Element {
        const { updatePasswordIsLoading, username } = this.props;
        return (
            <Formik
                initialValues={{ verificationCode: '', newPassword: '' }}
                onSubmit={(values: FormValues): void => {
                    this.props.updatePassword(username, values.verificationCode, values.newPassword);
                }}
                validationSchema={UpdatePasswordFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Verification Code"
                                nativeID="verificationCode"
                                onChangeText={handleChange('verificationCode')}
                                onBlur={handleBlur('verificationCode')}
                                value={values.verificationCode}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.verificationCode && touched.verificationCode ? (
                                <Text style={styles.errorMessage}>{errors.verificationCode}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Input
                                label="Password"
                                nativeID="newPassword"
                                secureTextEntry={true}
                                onChangeText={handleChange('newPassword')}
                                onBlur={handleBlur('newPassword')}
                                value={values.newPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.newPassword && touched.newPassword ? (
                                <Text style={styles.errorMessage}>{errors.newPassword}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={updatePasswordIsLoading} onPress={submitForm} title="Update" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { UpdatePasswordForm };
