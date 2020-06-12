/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { userActions } from '../actions/authenticatedSharedActions';
import { NavigationService } from '../../NavigationService';
import { Screens } from '../screens/Screens';

interface WhatIsYourFirstNameFormProps {
    updateCurrentUser: typeof userActions.updateCurrentUser;
    currentFirstName: string | undefined;
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
                    NavigationService.navigate({ screen: Screens.WhatIsYourLastName });
                }}
                validationSchema={WhatIsYourFirstNameFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="firstName"
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
