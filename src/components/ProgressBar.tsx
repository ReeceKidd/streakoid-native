import React, { PureComponent } from 'react';
import * as Progress from 'react-native-progress';
import { Dimensions } from 'react-native';

interface Props {
    completePercentage: number;
    fullScreen: boolean;
}

class ProgressBar extends PureComponent<Props> {
    getRedToGreenColor(percent: number): string {
        const red = percent < 50 ? 255 : Math.floor(255 - ((percent * 2 - 100) * 255) / 100);
        const green = percent > 50 ? 255 : Math.floor((percent * 2 * 255) / 100);
        return 'rgb(' + red + ',' + green + ',0)';
    }
    render(): JSX.Element | null {
        const { completePercentage, fullScreen } = this.props;
        const screenWidth = Dimensions.get('screen').width;
        const barWidth = fullScreen ? screenWidth : screenWidth * 0.9;
        if (!completePercentage || completePercentage <= 5) {
            return (
                <Progress.Bar
                    progress={0.05}
                    width={barWidth}
                    borderColor={'white'}
                    color={this.getRedToGreenColor(10)}
                />
            );
        }
        return (
            <Progress.Bar
                progress={completePercentage / 100}
                width={barWidth}
                borderColor={'white'}
                color={this.getRedToGreenColor(completePercentage)}
            />
        );
    }
}

export { ProgressBar };
