import React, { PureComponent } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    faFacebook,
    faYoutube,
    faAudible,
    faTwitter,
    faSnapchat,
    faInstagram,
    faReddit,
    faAmazon,
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
    faPhone,
    faSun,
    faPhoneRotary,
    faScarf,
    faLungs,
    faMusic,
    faProcedures,
    faBookAlt,
    faCookie,
    faSkiLift,
    faSwimmingPool,
    faScrollOld,
    faBookSpells,
    faJackOLantern,
    faGuitars,
    faGlobeEurope,
    faChild,
    faRunning,
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
    faPencil,
    faTruckMoving,
    faDog,
    faHandsHeart,
    faHeartCircle,
    faSunglasses,
    faHandshakeAlt,
    faGlass,
    faHandPaper,
    faSmokingBan,
    faAppleCrate,
    faMugTea,
    faWineBottle,
    faPenAlt,
    faPie,
    faCow,
    faBreadLoaf,
    faUmbrellaBeach,
    faTvRetro,
    faWater,
    faCarrot,
    faDigging,
    faCameraRetro,
    faLaptopCode,
    faLevelUp,
    faRobot,
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
    faSmileBeam,
    faLaugh,
    faThumbsUp,
    faSurprise,
    faSmile,
    faDemocrat,
    faPencilAlt,
    faPaintBrush,
    faMugHot,
    faGrinBeamSweat,
    faTv,
    faTint,
    faHiking,
    faLeaf,
    faSortNumericUp,
    faHome,
} from '@fortawesome/free-solid-svg-icons';
import { faHeadSideMedical } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface ChallengeIconProps {
    icon?: IconProp | string;
    color?: string;
}

class ChallengeIcon extends PureComponent<ChallengeIconProps> {
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

            case 'phone':
                return <FontAwesomeIcon icon={faPhone} style={{ color }} />;

            case 'smile-beam':
                return <FontAwesomeIcon icon={faSmileBeam} style={{ color }} />;

            case 'pencil':
                return <FontAwesomeIcon icon={faPencil} style={{ color }} />;

            case 'laugh':
                return <FontAwesomeIcon icon={faLaugh} style={{ color }} />;

            case 'sun':
                return <FontAwesomeIcon icon={faSun} style={{ color }} />;

            case 'truck-moving':
                return <FontAwesomeIcon icon={faTruckMoving} style={{ color }} />;

            case 'dog':
                return <FontAwesomeIcon icon={faDog} style={{ color }} />;

            case 'hands-heart':
                return <FontAwesomeIcon icon={faHandsHeart} style={{ color }} />;

            case 'phone-rotary':
                return <FontAwesomeIcon icon={faPhoneRotary} style={{ color }} />;

            case 'scarf':
                return <FontAwesomeIcon icon={faScarf} style={{ color }} />;

            case 'lungs':
                return <FontAwesomeIcon icon={faLungs} style={{ color }} />;

            case 'music':
                return <FontAwesomeIcon icon={faMusic} style={{ color }} />;

            case 'thumbs-up':
                return <FontAwesomeIcon icon={faThumbsUp} style={{ color }} />;

            case 'surprise':
                return <FontAwesomeIcon icon={faSurprise} style={{ color }} />;

            case 'heart-circle':
                return <FontAwesomeIcon icon={faHeartCircle} style={{ color }} />;

            case 'sunglasses':
                return <FontAwesomeIcon icon={faSunglasses} style={{ color }} />;

            case 'smile':
                return <FontAwesomeIcon icon={faSmile} style={{ color }} />;

            case 'handshake-alt':
                return <FontAwesomeIcon icon={faHandshakeAlt} style={{ color }} />;

            case 'glass':
                return <FontAwesomeIcon icon={faGlass} style={{ color }} />;

            case 'hand-paper':
                return <FontAwesomeIcon icon={faHandPaper} style={{ color }} />;

            case 'democrat':
                return <FontAwesomeIcon icon={faDemocrat} style={{ color }} />;

            case 'smoking-ban':
                return <FontAwesomeIcon icon={faSmokingBan} style={{ color }} />;

            case 'procedures':
                return <FontAwesomeIcon icon={faProcedures} style={{ color }} />;

            case 'apple-crate':
                return <FontAwesomeIcon icon={faAppleCrate} style={{ color }} />;

            case 'mug-tea':
                return <FontAwesomeIcon icon={faMugTea} style={{ color }} />;

            case 'wine-bottle':
                return <FontAwesomeIcon icon={faWineBottle} style={{ color }} />;

            case 'pencil-alt':
                return <FontAwesomeIcon icon={faPencilAlt} style={{ color }} />;

            case 'paint-brush':
                return <FontAwesomeIcon icon={faPaintBrush} style={{ color }} />;

            case 'pen-alt':
                return <FontAwesomeIcon icon={faPenAlt} style={{ color }} />;

            case 'book-alt':
                return <FontAwesomeIcon icon={faBookAlt} style={{ color }} />;

            case 'mug-hot':
                return <FontAwesomeIcon icon={faMugHot} style={{ color }} />;

            case 'grin-beam-sweat':
                return <FontAwesomeIcon icon={faGrinBeamSweat} style={{ color }} />;

            case 'tv':
                return <FontAwesomeIcon icon={faTv} style={{ color }} />;

            case 'amazon':
                return <FontAwesomeIcon icon={faAmazon} style={{ color }} />;

            case 'cookie':
                return <FontAwesomeIcon icon={faCookie} style={{ color }} />;

            case 'pie':
                return <FontAwesomeIcon icon={faPie} style={{ color }} />;

            case 'cow':
                return <FontAwesomeIcon icon={faCow} style={{ color }} />;

            case 'bread-loaf':
                return <FontAwesomeIcon icon={faBreadLoaf} style={{ color }} />;

            case 'umbrella-beach':
                return <FontAwesomeIcon icon={faUmbrellaBeach} style={{ color }} />;

            case 'tint':
                return <FontAwesomeIcon icon={faTint} style={{ color }} />;

            case 'tv-retro':
                return <FontAwesomeIcon icon={faTvRetro} style={{ color }} />;

            case 'ski-lift':
                return <FontAwesomeIcon icon={faSkiLift} style={{ color }} />;

            case 'hiking':
                return <FontAwesomeIcon icon={faHiking} style={{ color }} />;

            case 'water':
                return <FontAwesomeIcon icon={faWater} style={{ color }} />;

            case 'swimming-pool':
                return <FontAwesomeIcon icon={faSwimmingPool} style={{ color }} />;

            case 'carrot':
                return <FontAwesomeIcon icon={faCarrot} style={{ color }} />;

            case 'leaf':
                return <FontAwesomeIcon icon={faLeaf} style={{ color }} />;

            case 'scroll-old':
                return <FontAwesomeIcon icon={faScrollOld} style={{ color }} />;

            case 'sort-numeric-up':
                return <FontAwesomeIcon icon={faSortNumericUp} style={{ color }} />;

            case 'book-spells':
                return <FontAwesomeIcon icon={faBookSpells} style={{ color }} />;

            case 'jack-o-lantern':
                return <FontAwesomeIcon icon={faJackOLantern} style={{ color }} />;

            case 'guitars':
                return <FontAwesomeIcon icon={faGuitars} style={{ color }} />;

            case 'digging':
                return <FontAwesomeIcon icon={faDigging} style={{ color }} />;

            case 'home':
                return <FontAwesomeIcon icon={faHome} style={{ color }} />;

            case 'camera-retro':
                return <FontAwesomeIcon icon={faCameraRetro} style={{ color }} />;

            case 'globe-europe':
                return <FontAwesomeIcon icon={faGlobeEurope} style={{ color }} />;

            case 'laptop-code':
                return <FontAwesomeIcon icon={faLaptopCode} style={{ color }} />;

            case 'level-up':
                return <FontAwesomeIcon icon={faLevelUp} style={{ color }} />;

            case 'child':
                return <FontAwesomeIcon icon={faChild} style={{ color }} />;

            case 'head-side-mask':
                return <FontAwesomeIcon icon={faHeadSideMedical} style={{ color }} />;

            case 'running':
                return <FontAwesomeIcon icon={faRunning} style={{ color }} />;

            case 'emoji-happy':
                return <FontAwesomeIcon icon={faSmileBeam} style={{ color }} />;

            default:
                return <FontAwesomeIcon icon={faRobot} style={{ color: 'black' }} />;
        }
    }
}

export { ChallengeIcon };
