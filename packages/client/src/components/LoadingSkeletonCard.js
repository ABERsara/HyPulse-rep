import { View, StyleSheet, Text } from 'react-native';

export default function LoadingSkeletonCard() {
    return (
        <View>
            <View style={styles.card}>
                <View style={styles.thumbnail} />
                <View style={styles.title} />
                <View style={styles.host} />
            </View>
            <View style={styles.card}>
                <View style={styles.thumbnail} />
                <View style={styles.title} />
                <View style={styles.host} />
            </View>
            <View style={styles.card}>
                <View style={styles.thumbnail} />
                <View style={styles.title} />
                <View style={styles.host} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    thumbnail: {
        width: '100%',
        height: 180,
        backgroundColor: '#d1d5db',
        marginBottom: 10,
    },
    title: {
        width: '80%',
        height: 30,
        backgroundColor: '#d1d5db',
        marginBottom: 8,
    },
    host: {
        width: '45%',
        height: 30,
        backgroundColor: '#d1d5db',
        marginBottom: 8,
    },
});