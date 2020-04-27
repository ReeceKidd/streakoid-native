/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';

interface FormValues {
    username: string;
    email: string;
    password: string;
}

interface RegisterFormProps {
    registerUser: ({ username, email, password }: { username: string; email: string; password: string }) => void;
    clearRegisterErrorMessage: () => void;
    registerIsLoading: boolean;
}

const RegisterFormSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').trim().required('Required'),
    password: Yup.string().min(8, 'Too short').required('Required'),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

class RegisterForm extends React.Component<RegisterFormProps> {
    render(): JSX.Element {
        const { registerIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ username: '', email: '', password: '' }}
                onSubmit={({ username, email, password }: FormValues): void => {
                    this.props.registerUser({ username, email: email.trim(), password });
                }}
                validationSchema={RegisterFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Username"
                                nativeID="username"
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                                autoCapitalize="none"
                                autoCompleteType="username"
                                autoCorrect={false}
                            />
                            {errors.username && touched.username ? (
                                <Text style={styles.errorMessage}>{errors.username}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Input
                                label="Email"
                                nativeID="email"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                autoCapitalize="none"
                                autoCompleteType="email"
                                autoCorrect={false}
                            />
                            {errors.email && touched.email ? (
                                <Text style={styles.errorMessage}>{errors.email}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Input
                                label="Password"
                                nativeID="password"
                                secureTextEntry={true}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                autoCapitalize="none"
                                autoCompleteType="password"
                                autoCorrect={false}
                            />
                            {errors.password && touched.password ? (
                                <Text style={styles.errorMessage}>{errors.password}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={registerIsLoading} onPress={submitForm} title="Submit" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { RegisterForm };
