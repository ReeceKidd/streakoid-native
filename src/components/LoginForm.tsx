/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { ErrorMessage } from './ErrorMessage';
import { authActions } from '../actions/unauthenticatedSharedActions';

interface FormValues {
    email: string;
    password: string;
}

interface LoginFormProps {
    loginUser: typeof authActions.loginUser;
    clearLoginErrorMessage: () => void;
    clearUpdatePasswordSuccessMessage: () => void;
    loginIsLoading: boolean;
}

const LoginFormSchema = Yup.object().shape({
    email: Yup.string().trim().required('Required'),
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
                initialValues={{ email: '', password: '' }}
                onSubmit={({ email, password }: FormValues): void => {
                    this.props.loginUser({
                        emailOrCognitoUsername: email.trim(),
                        password,
                        redirectToHomeOnLogin: true,
                    });
                }}
                validationSchema={LoginFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Email"
                                nativeID="email"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.email && touched.email ? <ErrorMessage message={errors.email} /> : null}
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
