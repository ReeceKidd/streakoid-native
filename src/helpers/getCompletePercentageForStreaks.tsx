export const getCompletePercentageForStreaks = ({
    numberOfStreaks,
    numberOfIncompleteStreaks,
}: {
    numberOfStreaks: number;
    numberOfIncompleteStreaks: number;
}) => {
    const incompletePercentage = (numberOfIncompleteStreaks / numberOfStreaks) * 100;
    const displayPercentage = 100 - incompletePercentage;
    return displayPercentage;
};
