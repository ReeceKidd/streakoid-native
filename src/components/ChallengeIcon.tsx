import React, { Component } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faFacebook,
    faYoutube,
    faAudible,
    faTwitter,
    faSnapchat,
    faInstagram,
    faReddit,
} from '@fortawesome/free-brands-svg-icons';
import {
    faBreadSlice,
    faBook,
    faWalking,
    faGuitar,
    faComputerClassic,
    faAlarmExclamation,
    faCoffee,
    faAbacus,
    faFlaskPotion,
    faFlaskPoison,
    faCoffeeTogo,
    faScanner,
} from '@fortawesome/pro-solid-svg-icons';
import {
    faBeer,
    faCrow,
    faNewspaper,
    faGlobe,
    faClock,
    faRecycle,
    faSandwich,
    faSackDollar,
    faAlarmClock,
    faDumbbell,
    faSalad,
    faHandHeart,
    faUtensilsAlt,
    faFrenchFries,
    faDewpoint,
    faBrain,
    faSteak,
    faAlarmSnooze,
    faUtensils,
    faClipboardListCheck,
    faFishCooked,
    faBlanket,
    faStomach,
    faChessKingAlt,
    faShower,
    faBath,
    faChartPieAlt,
} from '@fortawesome/pro-solid-svg-icons';
import {
    faCreditCard,
    faBicycle,
    faBed,
    faPodcast,
    faSeedling,
    faTeeth,
    faAllergies,
    faTeethOpen,
    faUserInjured,
    faChartPie,
} from '@fortawesome/free-solid-svg-icons';

interface ChallengeIconProps {
    icon: IconProp;
    color: string;
}

class ChallengeIcon extends Component<ChallengeIconProps> {
    render(): JSX.Element | null {
        const { icon, color } = this.props;
        switch (icon) {
            case 'bread-slice':
                return <FontAwesomeIcon icon={faBreadSlice} style={{ color }} />;

            case 'brain':
                return <FontAwesomeIcon icon={faBrain} style={{ color }} />;

            case 'book':
                return <FontAwesomeIcon icon={faBook} style={{ color }} />;

            case 'walking':
                return <FontAwesomeIcon icon={faWalking} style={{ color }} />;

            case 'guitar':
                return <FontAwesomeIcon icon={faGuitar} style={{ color }} />;

            case 'dewpoint':
                return <FontAwesomeIcon icon={faDewpoint} style={{ color }} />;

            case 'computer-classic':
                return <FontAwesomeIcon icon={faComputerClassic} style={{ color }} />;

            case 'crow':
                return <FontAwesomeIcon icon={faCrow} style={{ color }} />;

            case 'newspaper':
                return <FontAwesomeIcon icon={faNewspaper} style={{ color }} />;

            case 'globe':
                return <FontAwesomeIcon icon={faGlobe} style={{ color }} />;

            case 'facebook':
                return <FontAwesomeIcon icon={faFacebook} style={{ color }} />;

            case 'youtube':
                return <FontAwesomeIcon icon={faYoutube} style={{ color }} />;

            case 'clock':
                return <FontAwesomeIcon icon={faClock} style={{ color }} />;

            case 'beer':
                return <FontAwesomeIcon icon={faBeer} style={{ color }} />;

            case 'steak':
                return <FontAwesomeIcon icon={faSteak} style={{ color }} />;

            case 'recycle':
                return <FontAwesomeIcon icon={faRecycle} style={{ color }} />;

            case 'french-fries':
                return <FontAwesomeIcon icon={faFrenchFries} style={{ color }} />;

            case 'coffee':
                return <FontAwesomeIcon icon={faCoffee} style={{ color }} />;

            case 'alarm-snooze':
                return <FontAwesomeIcon icon={faAlarmSnooze} style={{ color }} />;

            case 'sandwich':
                return <FontAwesomeIcon icon={faSandwich} style={{ color }} />;

            case 'utensils':
                return <FontAwesomeIcon icon={faUtensils} style={{ color }} />;

            case 'sack-dollar':
                return <FontAwesomeIcon icon={faSackDollar} style={{ color }} />;

            case 'credit-card':
                return <FontAwesomeIcon icon={faCreditCard} style={{ color }} />;

            case 'bicycle':
                return <FontAwesomeIcon icon={faBicycle} style={{ color }} />;

            case 'clipboard-list-check':
                return <FontAwesomeIcon icon={faClipboardListCheck} style={{ color }} />;

            case 'bed':
                return <FontAwesomeIcon icon={faBed} style={{ color }} />;

            case 'alarm-clock':
                return <FontAwesomeIcon icon={faAlarmClock} style={{ color }} />;

            case 'audible':
                return <FontAwesomeIcon icon={faAudible} style={{ color }} />;

            case 'podcast':
                return <FontAwesomeIcon icon={faPodcast} style={{ color }} />;

            case 'dumbbell':
                return <FontAwesomeIcon icon={faDumbbell} style={{ color }} />;

            case 'salad':
                return <FontAwesomeIcon icon={faSalad} style={{ color }} />;

            case 'seedling':
                return <FontAwesomeIcon icon={faSeedling} style={{ color }} />;

            case 'fish-cooked':
                return <FontAwesomeIcon icon={faFishCooked} style={{ color }} />;

            case 'tooth':
                return <FontAwesomeIcon icon={faTeeth} style={{ color }} />;

            case 'hand-heart':
                return <FontAwesomeIcon icon={faHandHeart} style={{ color }} />;

            case 'blanket':
                return <FontAwesomeIcon icon={faBlanket} style={{ color }} />;

            case 'utensils-alt':
                return <FontAwesomeIcon icon={faUtensilsAlt} style={{ color }} />;

            case 'stomach':
                return <FontAwesomeIcon icon={faStomach} style={{ color }} />;

            case 'twitter':
                return <FontAwesomeIcon icon={faTwitter} style={{ color }} />;

            case 'snapchat':
                return <FontAwesomeIcon icon={faSnapchat} style={{ color }} />;

            case 'instagram':
                return <FontAwesomeIcon icon={faInstagram} style={{ color }} />;

            case 'reddit':
                return <FontAwesomeIcon icon={faReddit} style={{ color }} />;

            case 'allergies':
                return <FontAwesomeIcon icon={faAllergies} style={{ color }} />;

            case 'teeth-open':
                return <FontAwesomeIcon icon={faTeethOpen} style={{ color }} />;

            case 'user-injured':
                return <FontAwesomeIcon icon={faUserInjured} style={{ color }} />;

            case 'chess-king-alt':
                return <FontAwesomeIcon icon={faChessKingAlt} style={{ color }} />;

            case 'chart-pie':
                return <FontAwesomeIcon icon={faChartPie} style={{ color }} />;

            case 'shower':
                return <FontAwesomeIcon icon={faShower} style={{ color }} />;

            case 'bath':
                return <FontAwesomeIcon icon={faBath} style={{ color }} />;

            case 'alarm-exclamation':
                return <FontAwesomeIcon icon={faAlarmExclamation} style={{ color }} />;

            case 'abacus':
                return <FontAwesomeIcon icon={faAbacus} style={{ color }} />;

            case 'chart-pie-alt':
                return <FontAwesomeIcon icon={faChartPieAlt} style={{ color }} />;

            case 'flask-poison':
                return <FontAwesomeIcon icon={faFlaskPoison} style={{ color }} />;

            case 'flask-potion':
                return <FontAwesomeIcon icon={faFlaskPotion} style={{ color }} />;

            case 'coffee-togo':
                return <FontAwesomeIcon icon={faCoffeeTogo} style={{ color }} />;

            case 'scanner':
                return <FontAwesomeIcon icon={faScanner} style={{ color }} />;

            default:
                return null;
        }
    }
}

export { ChallengeIcon };
