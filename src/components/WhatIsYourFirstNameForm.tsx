/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { userActions } from '../actions/authenticatedSharedActions';
import { Screens } from '../screens/Screens';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

interface WhatIsYourFirstNameFormProps {
    updateCurrentUser: typeof userActions.updateCurrentUser;
    currentFirstName: string | undefined;
    navigation: StackNavigationProp<RootStackParamList, Screens.WhatIsYourFirstName>;
}

interface FormValues {
    firstName: string;
}

const WhatIsYourFirstNameFormSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

class WhatIsYourFirstNameForm extends PureComponent<WhatIsYourFirstNameFormProps> {
    render(): JSX.Element {
        const { currentFirstName } = this.props;
        return (
            <Formik
                initialValues={{ firstName: currentFirstName ? currentFirstName : '' }}
                onSubmit={({ firstName }: FormValues): void => {
                    this.props.updateCurrentUser({ updateData: { firstName } });
                    this.props.navigation.navigate(Screens.WhatIsYourLastName);
                }}
                validationSchema={WhatIsYourFirstNameFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label={'What is your first name?'}
                                nativeID="firstName"
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                                value={values.firstName}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.firstName && touched.firstName ? (
                                <Text style={styles.errorMessage}>{errors.firstName}</Text>
                            ) : null}
                        </Spacer>
                        <Spacer>
                            <Button onPress={submitForm} title="Next" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { WhatIsYourFirstNameForm };
