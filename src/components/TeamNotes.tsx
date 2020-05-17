import React, { PureComponent } from 'react';

import { noteActions } from '../actions/sharedActions';
import { bindActionCreators, Dispatch } from 'redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { connect } from 'react-redux';
import { Text, Button, ListItem } from 'react-native-elements';
import { ActivityIndicator, FlatList } from 'react-native';
import { AppState } from '../../store';
import { NoteWithClientData } from '@streakoid/streakoid-shared/lib/reducers/notesReducer';
import { Spacer } from './Spacer';
import { NavigationEvents, NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Screens } from '../screens/Screens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

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
    subjectId?: string;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NotesProps & NavigationProps;

class NotesComponent extends PureComponent<Props> {
    getNotes = (): void => {
        const { subjectId } = this.props;
        const query: { subjectId?: string } = {};
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
                        const {
                            text,
                            createdAt,
                            _id,
                            userId,
                            deleteNoteIsLoading,
                            noteCreatorProfilePicture,
                            noteCreatorUsername,
                        } = item;

                        return (
                            <ListItem
                                key={_id}
                                title={text}
                                subtitle={new Date(createdAt).toDateString()}
                                leftAvatar={{
                                    source: { uri: noteCreatorProfilePicture },
                                    onPress: () => {
                                        this.props.navigation.navigate(Screens.UserProfile, {
                                            username: noteCreatorUsername,
                                            _id: userId,
                                        });
                                    },
                                }}
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
const TeamNotes = connect(mapStateToProps, mapDispatchToProps)(NotesComponent);
export { TeamNotes };
