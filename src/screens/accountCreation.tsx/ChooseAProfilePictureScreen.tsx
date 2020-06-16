/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { Button, Text } from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';

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
import { apiUrl, getIdToken } from '../../api/authenticatedStreakoid';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';
import { AccountStrengthProgressBar } from '../../components/AccountStrengthProgressBar';

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
    uploadProfileImage: bindActionCreators(profilePictureActions.mobileUploadProfileImage, dispatch),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ChooseAProfilePictureScreenComponent extends PureComponent<Props, { photo: any }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            photo: null,
        };
    }

    componentDidMount() {
        this.props.clearUploadProfileImageMessages();
    }

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.uri) {
                this.setState({ photo: response });
                this.uploadPhoto();
            }
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploadPhoto = async () => {
        const formData = new FormData();
        const { photo } = this.state;

        formData.append('image', photo);

        const url = `${apiUrl}/v1/${RouterCategories.profileImages}`;

        const idToken = await getIdToken();
        const timezone = this.props.currentUser.timezone;

        const uploadProfilePictureFunction = () =>
            RNFetchBlob.fetch(
                'POST',
                url,
                {
                    [SupportedRequestHeaders.Authorization]: idToken || '',
                    [SupportedRequestHeaders.Timezone]: timezone,
                    'Content-Type': 'multipart/form-data',
                },
                [
                    {
                        name: 'image',
                        filename: photo.fileName,
                        type: 'image/jpeg',
                        data: RNFetchBlob.wrap(photo.uri),
                    },
                ],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;
        this.props.uploadProfileImage({ uploadProfilePictureFunction });
    };
    render(): JSX.Element {
        const { currentUser, profileImage, uploadProfileImageIsLoading, uploadProfileImageErrorMessage } = this.props;
        return (
            <View style={styles.container}>
                <AccountStrengthProgressBar currentUser={currentUser} />
                <Spacer>
                    <Text style={{ fontWeight: 'bold' }}> Choose your profile picture </Text>
                    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                        <Avatar
                            renderPlaceholderContent={<ActivityIndicator />}
                            source={{ uri: (this.state.photo && this.state.photo.uri) || profileImage }}
                            size="large"
                            rounded
                            onPress={() => this.handleChoosePhoto()}
                        />
                    </View>

                    <Button
                        title="Next"
                        loading={uploadProfileImageIsLoading}
                        onPress={() => this.props.navigation.navigate(Screens.CompletedCustomization)}
                    ></Button>
                    {uploadProfileImageErrorMessage ? <Text>{uploadProfileImageErrorMessage}</Text> : null}
                </Spacer>
            </View>
        );
    }
}

const ChooseAProfilePictureScreen = connect(mapStateToProps, mapDispatchToProps)(ChooseAProfilePictureScreenComponent);

export { ChooseAProfilePictureScreen };