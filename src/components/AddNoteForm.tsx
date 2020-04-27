/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Yup from 'yup';

import { Formik } from 'formik';
import { Spacer } from './Spacer';
import { ErrorMessage } from './ErrorMessage';
import { noteActions } from '../actions/sharedActions';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

interface AddNoteToStreakFormProps {
    createNote: typeof noteActions.createNote;
    streakId: string;
    streakType: StreakTypes;
    createNoteErrorMessage: string;
    createNoteIsLoading: boolean;
}

interface FormValues {
    text: string;
}

type AddNoteFormProps = AddNoteToStreakFormProps & FormValues;

const AddNoteFormSchema = Yup.object().shape({
    text: Yup.string().required('Required'),
});

class AddNoteForm extends React.Component<AddNoteFormProps> {
    render(): JSX.Element {
        const { streakId, createNoteIsLoading, streakType } = this.props;
        return (
            <Formik
                initialValues={{ text: '' }}
                onSubmit={(values: FormValues): void => {
                    this.props.createNote({ text: values.text, subjectId: streakId, streakType });
                }}
                validationSchema={AddNoteFormSchema}
            >
                {({ handleChange, handleBlur, values, errors, submitForm, touched }): JSX.Element => (
                    <View>
                        <Spacer>
                            <Input
                                label="Note"
                                nativeID="text"
                                onChangeText={handleChange('text')}
                                onBlur={handleBlur('text')}
                                value={values.text}
                                autoCapitalize="none"
                                autoCorrect={false}
                                multiline={true}
                            />
                            {errors.text && touched.text ? <ErrorMessage message={errors.text} /> : null}
                        </Spacer>
                        <Spacer>
                            <Button loading={createNoteIsLoading} onPress={submitForm} title="Enter" />
                        </Spacer>
                    </View>
                )}
            </Formik>
        );
    }
}

export { AddNoteForm };
