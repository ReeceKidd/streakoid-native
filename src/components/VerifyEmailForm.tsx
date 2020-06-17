import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { authActions } from '../actions/authActions';

interface VerifyEmailFormProps {
    verifyEmail: typeof authActions.verifyEmail;
    verifyEmailErrorMessage: string;
    verifyEmailIsLoading: boolean;
}

interface FormValues {
    verificationCode: string;
}

const VerifyEmailFormSchema = Yup.object().shape({
    verificationCode: Yup.string().required('Required'),
});
const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
    },
});

class VerifyEmailForm extends PureComponent<VerifyEmailFormProps> {
    render(): JSX.Element {
        const { verifyEmail, verifyEmailErrorMessage, verifyEmailIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ verificationCode: '' }}
                onSubmit={({ verificationCode }: FormValues): void => {
                    verifyEmail({ verificationCode, navigateToChoosePassword: true });
                }}
                validationSchema={VerifyEmailFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Verification code"
                                nativeID="verificationCode"
                                onChangeText={handleChange('verificationCode')}
                                onBlur={handleBlur('verificationCode')}
                                value={values.verificationCode}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Spacer />
                            {errors.verificationCode && touched.verificationCode ? (
                                <Text style={styles.errorMessage}>{errors.verificationCode}</Text>
                            ) : null}
                            {verifyEmailErrorMessage && touched.verificationCode ? (
                                <Text style={styles.errorMessage}>{verifyEmailErrorMessage}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={verifyEmailIsLoading} onPress={submitForm} title="Next" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { VerifyEmailForm };
