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

interface WhatIsYourLastNameFormProps {
    updateCurrentUser: typeof userActions.updateCurrentUser;
    currentLastName: string | undefined;
}

interface FormValues {
    lastName: string;
}

const WhatIsYourLastNameFormSchema = Yup.object().shape({
    lastName: Yup.string().required('Required'),
});

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

class WhatIsYourLastNameForm extends PureComponent<WhatIsYourLastNameFormProps> {
    render(): JSX.Element {
        const { currentLastName } = this.props;
        return (
            <Formik
                initialValues={{ lastName: currentLastName ? currentLastName : '' }}
                onSubmit={({ lastName }: FormValues): void => {
                    this.props.updateCurrentUser({ updateData: { lastName } });
                    NavigationService.navigate({ screen: Screens.WhatIsYourLastName });
                }}
                validationSchema={WhatIsYourLastNameFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="lastName"
                                nativeID="lastName"
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                                value={values.lastName}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.lastName && touched.lastName ? (
                                <Text style={styles.errorMessage}>{errors.lastName}</Text>
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

export { WhatIsYourLastNameForm };
