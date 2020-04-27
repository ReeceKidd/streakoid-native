/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Spacer } from './Spacer';
import { Input, Button, Text } from 'react-native-elements';

interface FormValues {
    verificationCode: string;
}

interface VerifyUserFormProps {
    verifyUser: (verificationCode: string) => void;
    verifyUserIsLoading: boolean;
}

const VerifyUserFormSchema = Yup.object().shape({
    verificationCode: Yup.string().required('Required'),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

class VerifyUserForm extends React.Component<VerifyUserFormProps> {
    render(): JSX.Element {
        const { verifyUserIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ verificationCode: '' }}
                onSubmit={(values: FormValues): void => {
                    this.props.verifyUser(values.verificationCode);
                }}
                validationSchema={VerifyUserFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Input
                            label="Verification Code"
                            nativeID="verificationCode"
                            onChangeText={handleChange('verificationCode')}
                            onBlur={handleBlur('verificationCode')}
                            value={values.verificationCode}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <Spacer>
                            {errors.verificationCode && touched.verificationCode ? (
                                <Text style={styles.errorMessage}>{errors.verificationCode}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={verifyUserIsLoading} onPress={submitForm} title="Login" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { VerifyUserForm };
