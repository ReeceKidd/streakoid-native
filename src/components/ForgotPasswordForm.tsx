import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { View, StyleSheet } from 'react-native';
import { Spacer } from './Spacer';
import { Input, Text, Button } from 'react-native-elements';

interface ForgotPasswordFormProps {
    forgotPassword: (emailOrUsername: string) => void;
    forgotPasswordIsLoading: boolean;
}

interface FormValues {
    emailOrUsername: string;
}

const ForgotPasswordFormSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required('Required'),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

class ForgotPasswordForm extends React.PureComponent<ForgotPasswordFormProps> {
    onSubmit = (formValues: FormValues): void => {
        const { emailOrUsername } = formValues;
        this.props.forgotPassword(emailOrUsername);
    };

    render(): JSX.Element {
        const { forgotPasswordIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ emailOrUsername: '' }}
                onSubmit={(values: FormValues): void => {
                    this.props.forgotPassword(values.emailOrUsername);
                }}
                validationSchema={ForgotPasswordFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Email or username"
                                nativeID="emailOrUsername"
                                onChangeText={handleChange('emailOrUsername')}
                                onBlur={handleBlur('emailOrUsername')}
                                value={values.emailOrUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.emailOrUsername && touched.emailOrUsername ? (
                                <Text style={styles.errorMessage}>{errors.emailOrUsername}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={forgotPasswordIsLoading} onPress={submitForm} title="Enter" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { ForgotPasswordForm };
