import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { auth, db } from '../firebaseConfig'
import { signOut } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const uid = auth.currentUser?.uid ?? ''
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (!uid) return
    const ref = doc(db, 'users', uid)
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) setUserData(snap.data())
    })
    return () => unsubscribe()
  }, [uid])

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>

      {/* Avatar + name */}
      <View style={styles.profileTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userData?.username?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.username}>{userData?.username ?? '...'}</Text>
        <Text style={styles.email}>{userData?.email ?? ''}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>🔥 {userData?.streak ?? 0}</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>📚 {userData?.progress ?? 0}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>🎯 {userData?.dailyGoal ?? 10}</Text>
          <Text style={styles.statLabel}>Daily goal</Text>
        </View>
      </View>

      {/* Settings list */}
      <View style={styles.settingsList}>
        {[
          { icon: 'person-outline', label: 'Edit profile', soon: true },
          { icon: 'notifications-outline', label: 'Notifications', soon: true },
          { icon: 'color-palette-outline', label: 'Appearance', soon: true },
          { icon: 'shield-outline', label: 'Privacy', soon: true },
        ].map(item => (
          <Pressable key={item.label} style={styles.settingsItem}>
            <Ionicons name={item.icon as any} size={20} color="#6C63FF" />
            <Text style={styles.settingsLabel}>{item.label}</Text>
            {item.soon && (
              <View style={styles.soonBadge}>
                <Text style={styles.soonText}>Soon</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color="#333" style={{ marginLeft: 'auto' }} />
          </Pressable>
        ))}
      </View>

      {/* Logout */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff4d4d" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 20,
  },
  profileTop: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  email: {
    fontSize: 13,
    color: '#555555',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#222235',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '600',
  },
  settingsList: {
    gap: 4,
    marginBottom: 28,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222235',
  },
  settingsLabel: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  soonBadge: {
    backgroundColor: '#2a2a3e',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  soonText: {
    fontSize: 10,
    color: '#6C63FF',
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1a0f0f',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ff4d4d22',
  },
  logoutText: {
    color: '#ff4d4d',
    fontSize: 15,
    fontWeight: '700',
  },
})