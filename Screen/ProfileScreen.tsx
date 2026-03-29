import { View, Text, StyleSheet, Pressable } from 'react-native'

export default function ProfileScreen() {

    return(
        <View style={Styles.container}>

            <Text style={Styles.title}>Profile-Page 🥰</Text>
            <Text style={Styles.subtitle}>nothing to see here lol ☠️</Text>


        </View>
    )
}

const Styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
        gap: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
    },
    subtitle: {
        fontSize: 16,
        color: '#888888',
    },
})