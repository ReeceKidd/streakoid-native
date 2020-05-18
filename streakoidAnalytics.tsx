import { streakoidAnalytics as streakoidAnalyticsImport } from '@streakoid/streakoid-analytics';
import analytics from '@segment/analytics-react-native';
const streakoidAnalytics = streakoidAnalyticsImport(analytics);

export { streakoidAnalytics };
