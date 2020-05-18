import React, { PureComponent } from 'react';
import * as Progress from 'react-native-progress';

interface Props {
    progress: number;
}

class ProgressBar extends PureComponent<Props> {
    getColor(percent: number): string {
        const red = percent < 50 ? 255 : Math.floor(255 - ((percent * 2 - 100) * 255) / 100);
        const green = percent > 50 ? 255 : Math.floor((percent * 2 * 255) / 100);
        return 'rgb(' + red + ',' + green + ',0)';
    }
    render(): JSX.Element {
        const { progress } = this.props;
        if (progress < 10) {
            return <Progress.Bar progress={0.1} borderRadius={0} borderColor={'white'} color={this.getColor(10)} />;
        }
        return (
            <Progress.Bar
                progress={progress / 100}
                width={null}
                borderColor={'white'}
                color={this.getColor(progress)}
            />
        );
    }
}

export { ProgressBar };
