import React, { PureComponent } from 'react';
import * as Progress from 'react-native-progress';
import { Dimensions } from 'react-native';

interface Props {
    progress: number;
}

class ProgressBar extends PureComponent<Props> {
    getColor(percent: number): string {
        const red = percent < 50 ? 255 : Math.floor(255 - ((percent * 2 - 100) * 255) / 100);
        const green = percent > 50 ? 255 : Math.floor((percent * 2 * 255) / 100);
        return 'rgb(' + red + ',' + green + ',0)';
    }
    render(): JSX.Element | null {
        const { progress } = this.props;
        const barWidth = Dimensions.get('screen').width;
        if (!progress) {
            return null;
        }
        if (progress < 10) {
            return <Progress.Bar progress={0.1} width={barWidth} borderColor={'white'} color={this.getColor(10)} />;
        }
        return (
            <Progress.Bar
                progress={progress / 100}
                width={barWidth}
                useNativeDriver={true}
                borderColor={'white'}
                color={this.getColor(progress)}
            />
        );
    }
}

export { ProgressBar };
