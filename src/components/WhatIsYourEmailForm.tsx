import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { authActions } from '../actions/authActions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { Screens } from '../screens/Screens';

interface FormValues {
    email: string;
}

interface WhatIsYourEmailFormProps {
    updateUserEmailAttribute: typeof authActions.updateUserEmailAttribute;
    updateUserEmailAttributeIsLoading: boolean;
    updateUserEmailAttributeErrorMessage: string;
    navigation: StackNavigationProp<RootStackParamList, Screens.WhatIsYourEmail>;
}

interface FormValues {
    email: string;
}

const WhatIsYourEmailFormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
    },
});

class WhatIsYourEmailForm extends PureComponent<WhatIsYourEmailFormProps> {
    render(): JSX.Element {
        const { updateUserEmailAttributeIsLoading, updateUserEmailAttributeErrorMessage } = this.props;
        return (
            <Formik
                initialValues={{ email: '' }}
                onSubmit={({ email }: FormValues): void => {
                    this.props.updateUserEmailAttribute({ email });
                }}
                validationSchema={WhatIsYourEmailFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="What is your email?"
                                nativeID="email"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                autoCapitalize="none"
                                autoCompleteType="email"
                                autoCorrect={false}
                            />
                            <Spacer />
                            {errors.email && touched.email ? (
                                <Text style={styles.errorMessage}>{errors.email}</Text>
                            ) : null}
                            {updateUserEmailAttributeErrorMessage && touched.email ? (
                                <Text style={styles.errorMessage}>{updateUserEmailAttributeErrorMessage}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={updateUserEmailAttributeIsLoading} onPress={submitForm} title="Next" />
                        </Spacer>
                        {updateUserEmailAttributeErrorMessage ? (
                            <Spacer>
                                <Button
                                    loading={updateUserEmailAttributeIsLoading}
                                    type="clear"
                                    onPress={() => this.props.navigation.navigate(Screens.VerifyEmail)}
                                    title="Skip"
                                />
                            </Spacer>
                        ) : null}
                    </View>
                )}
            </Formik>
        );
    }
}

export { WhatIsYourEmailForm };
