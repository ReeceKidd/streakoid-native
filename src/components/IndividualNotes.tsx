import React, { Component } from 'react';

import { noteActions } from '../actions/sharedActions';
import { bindActionCreators, Dispatch } from 'redux';
import { AppActions, AppState } from '@streakoid/streakoid-shared/lib';
import { connect } from 'react-redux';
import { Text, Button, ListItem } from 'react-native-elements';
import { ActivityIndicator, FlatList } from 'react-native';
import { NoteWithClientData } from '@streakoid/streakoid-shared/lib/reducers/notesReducer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { Spacer } from './Spacer';
import { NavigationEvents } from 'react-navigation';

const mapStateToProps = (state: AppState) => {
    const notes = state && state.notes && state.notes.notes;
    const getMultipleNotesIsLoading = state && state.notes && state.notes.getMultipleNotesIsLoading;
    return {
        notes,
        getMultipleNotesIsLoading,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getNotes: bindActionCreators(noteActions.getNotes, dispatch),
    deleteNote: bindActionCreators(noteActions.deleteNote, dispatch),
    clearNotes: bindActionCreators(noteActions.clearNotes, dispatch),
});

interface NotesProps {
    userId?: string;
    subjectId?: string;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NotesProps;

class NotesComponent extends Component<Props> {
    getNotes = (): void => {
        const { userId, subjectId } = this.props;
        const query: { userId?: string; subjectId?: string } = {};
        if (userId) {
            query.userId = userId;
        }
        if (subjectId) {
            query.subjectId = subjectId;
        }
        this.props.getNotes(query);
    };

    getFormattedCreatedAtString = (noteCreatedAt: string) => {
        const date = new Date(noteCreatedAt).toDateString();
        const hours = new Date(noteCreatedAt).getHours();
        const minutes = new Date(noteCreatedAt).getMinutes();
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${date} - ${hours}:${formattedMinutes}`;
    };

    render(): JSX.Element {
        const { notes, getMultipleNotesIsLoading } = this.props;
        return (
            <>
                <NavigationEvents onWillFocus={() => this.getNotes()} onWillBlur={() => this.props.clearNotes()} />
                {!getMultipleNotesIsLoading && notes.length === 0 ? (
                    <Spacer>
                        <Text style={{ color: 'red' }}>{`No notes `}</Text>
                    </Spacer>
                ) : null}
                <FlatList
                    data={notes}
                    keyExtractor={(note: NoteWithClientData) => note._id}
                    renderItem={({ item }) => {
                        const { text, createdAt, _id, deleteNoteIsLoading } = item;

                        return (
                            <ListItem
                                key={_id}
                                title={text}
                                subtitle={new Date(createdAt).toDateString()}
                                rightElement={
                                    <Button
                                        icon={<FontAwesomeIcon icon={faTimes} size={25} style={{ color: 'white' }} />}
                                        buttonStyle={{ backgroundColor: 'red' }}
                                        onPress={() => this.props.deleteNote({ noteId: _id })}
                                        loading={deleteNoteIsLoading}
                                    ></Button>
                                }
                            />
                        );
                    }}
                />
                {getMultipleNotesIsLoading && notes.length === 0 ? <ActivityIndicator /> : null}
            </>
        );
    }
}
const IndividualNotes = connect(mapStateToProps, mapDispatchToProps)(NotesComponent);
export { IndividualNotes };
