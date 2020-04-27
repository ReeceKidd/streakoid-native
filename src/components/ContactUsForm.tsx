/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { ErrorMessage } from './ErrorMessage';
import { emailActions } from '../actions/sharedActions';

interface ContactUsToStreakFormProps {
    sendContactUsEmail: typeof emailActions.sendContactUsEmail;
    sendContactUsEmailIsLoading: boolean;
}

interface FormValues {
    name: string;
    email: string;
    message: string;
}

type ContactUsFormProps = ContactUsToStreakFormProps & FormValues;

const ContactUsFormSchema = Yup.object().shape({
    name: Yup.string().min(1, 'Too Short!').required('Required'),
    email: Yup.string().email('Invalid email').trim().required('Required'),
    message: Yup.string().required('Required'),
});

class ContactUsForm extends React.Component<ContactUsFormProps> {
    render(): JSX.Element {
        const { sendContactUsEmailIsLoading } = this.props;
        return (
            <Formik
                initialValues={{ name: '', email: '', message: '' }}
                onSubmit={(values: FormValues): void => {
                    const { name, email, message }: { name: string; email: string; message: string } = values;
                    this.props.sendContactUsEmail({ name, email: email.trim(), message });
                }}
                validationSchema={ContactUsFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Name"
                                nativeID="name"
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.name && touched.name ? <ErrorMessage message={errors.name} /> : null}
                        </Spacer>
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
                                label="Message"
                                nativeID="message"
                                onChangeText={handleChange('message')}
                                onBlur={handleBlur('message')}
                                value={values.message}
                                autoCapitalize="none"
                                autoCorrect={false}
                                multiline={true}
                            />
                            {errors.message && touched.message ? <ErrorMessage message={errors.message} /> : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={sendContactUsEmailIsLoading} onPress={submitForm} title="Send" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { ContactUsForm };
