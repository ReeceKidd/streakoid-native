/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { ErrorMessage } from './ErrorMessage';

interface FormValues {
    emailOrUsername: string;
    password: string;
}

interface LoginFormProps {
    loginUser: ({ emailOrUsername, password }: { emailOrUsername: string; password: string }) => void;
    clearLoginErrorMessage: () => void;
    clearUpdatePasswordSuccessMessage: () => void;
    loginIsLoading: boolean;
}

const LoginFormSchema = Yup.object().shape({
    emailOrUsername: Yup.string().trim().required('Required'),
    password: Yup.string().min(8, 'Too short').required('Required'),
});

class LoginForm extends PureComponent<LoginFormProps> {
    componentWillUnmount() {
        this.props.clearLoginErrorMessage();
        this.props.clearUpdatePasswordSuccessMessage();
    }
    render(): JSX.Element {
        const { loginIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ emailOrUsername: '', password: '' }}
                onSubmit={({ emailOrUsername, password }: FormValues): void => {
                    this.props.loginUser({ emailOrUsername: emailOrUsername.trim(), password });
                }}
                validationSchema={LoginFormSchema}
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
                                <ErrorMessage message={errors.emailOrUsername} />
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Input
                                label="Password"
                                nativeID="password"
                                autoCompleteType="password"
                                secureTextEntry={true}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onSubmitEditing={submitForm}
                            />
                            {errors.password && touched.password ? <ErrorMessage message={errors.password} /> : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={loginIsLoading} onPress={submitForm} title="Login" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { LoginForm };
