import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.medium,
    },
    centeredContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.medium,
    },
    card: {
        backgroundColor: theme.colors.surface,
        marginBottom: theme.spacing.medium,
    },
    cardTitle: {
        color: theme.colors.white,
    },
    cardSubtitle: {
        color: theme.colors.subtext,
    },
    title: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.xlarge,
        marginBottom: theme.spacing.medium,
    },
    subtitle: {
        color: theme.colors.subtext,
        marginBottom: theme.spacing.large,
        fontSize: theme.fontSizes.medium,
    },
    text: {
        color: theme.colors.text,
    },
    button: {
        backgroundColor: theme.colors.primary,
        marginVertical: theme.spacing.small,
    },
    fab: {
        position: 'absolute',
        margin: theme.spacing.medium,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.medium,
    },
    headerContainer: {
        padding: theme.spacing.medium,
        paddingBottom: 0,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: '#2c2c2c',
        padding: 8,
        borderRadius: 8,
        minWidth: 50,
        flex: 1,
    },
    statLabel: {
        color: theme.colors.subtext,
        fontSize: 12,
        fontWeight: 'bold',
    },
    statValue: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: theme.spacing.medium,
        marginTop: theme.spacing.medium,
    },
    actionsBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.medium,
        marginTop: theme.spacing.medium,
    },
    placeholder: {
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 32,
        padding: 20,
        backgroundColor: theme.colors.surface,
        textAlign: 'center',
    },
    listItem: {
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: theme.spacing.medium,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listItemTitle: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: theme.fontSizes.medium,
    },
    listItemSubtitle: {
        color: theme.colors.subtext,
    },
    input: {
        marginBottom: theme.spacing.medium,
        backgroundColor: '#2c2c2c',
    },
    list: {
        padding: theme.spacing.medium,
    },
    cardDetail: {
        color: theme.colors.subtext,
        marginTop: 4,
    },
    scrollContent: {
        paddingBottom: theme.spacing.large,
    },
});
