import React, { PureComponent, ChangeEvent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { userActions, profilePictureActions } from '../../actions/authenticatedSharedActions';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../Screens';
import { Spacer } from '../../components/Spacer';
import { Avatar } from 'react-native-elements';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const uploadProfileImageIsLoading = state && state.users && state.users.uploadProfileImageIsLoading;
    const uploadProfileImageErrorMessage = state && state.users && state.users.uploadProfileImageErrorMessage;
    const uploadProfileImageSuccessMessage = state && state.users && state.users.uploadProfileImageSuccessMessage;
    const currentUser = state && state.users && state.users.currentUser;
    const profileImages = currentUser && currentUser.profileImages;
    const profileImage = profileImages && profileImages.originalImageUrl;
    return {
        uploadProfileImageIsLoading,
        uploadProfileImageErrorMessage,
        uploadProfileImageSuccessMessage,
        profileImage,
        currentUser,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getUser: bindActionCreators(userActions.getUser, dispatch),
    uploadProfileImage: bindActionCreators(profilePictureActions.uploadProfileImage, dispatch),
    clearUploadProfileImageMessages: bindActionCreators(
        profilePictureActions.clearUploadProfileImageMessages,
        dispatch,
    ),
});
type ChooseAProfilePictureScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.ChooseAProfilePicture>;

type NavigationProps = {
    navigation: ChooseAProfilePictureScreenNavigationProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class ChooseAProfilePictureScreenComponent extends PureComponent<Props, { selectedFile: File | null }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedFile: null,
        };
    }

    componentDidMount(): void {
        this.props.clearUploadProfileImageMessages();
    }
    onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            selectedFile: event && event.target && event.target.files && event.target.files[0],
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploadImage = async (): Promise<void> => {
        // eslint-disable-next-line no-undef
        const formData = new FormData();
        if (this.state.selectedFile) {
            formData.append('image', this.state.selectedFile);
            this.props.uploadProfileImage({ formData });
        }
    };
    render(): JSX.Element {
        const { profileImage } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <Avatar
                        renderPlaceholderContent={<ActivityIndicator />}
                        source={{ uri: profileImage }}
                        size="large"
                        rounded
                    />
                    {/* <form className="form-group files" encType="multipart/form-data">
                        <input
                            type="file"
                            name="image"
                            className="form-control"
                            multiple={false}
                            onChange={this.onChangeHandler}
                        />
                    </form> */}
                </Spacer>
            </View>
        );
    }
}

const ChooseAProfilePictureScreen = connect(mapStateToProps, mapDispatchToProps)(ChooseAProfilePictureScreenComponent);

export { ChooseAProfilePictureScreen };
