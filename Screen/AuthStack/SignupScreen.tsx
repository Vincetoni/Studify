import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
  TextInput, View, Text, StyleSheet,
  ActivityIndicator, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type AuthStackParamList = {
  Signup: undefined;
  Login: undefined;
  OnBoarding: { uid: string; username: string };
};

type SignupNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Signup">;

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<SignupNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleSignup = async () => {
    setError("");
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, "users", res.user.uid), {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        createdAt: serverTimestamp(),
        onboardingCompleted: false,
        progress: 0,
      });
      navigation.navigate("OnBoarding", {
        uid: res.user.uid,
        username: username.trim(),
      });
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoIcon}>📚</Text>
          </View>
          <Text style={styles.appName}>Studify</Text>
          <Text style={styles.tagline}>Create your account</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>

          {/* Username */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#555" style={styles.inputIcon} />
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="How should we call you?"
                placeholderTextColor="#444"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#555" style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#444"
                keyboardType="email-address"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#555" style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor="#444"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#555" style={styles.inputIcon} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                placeholderTextColor="#444"
                secureTextEntry={!showConfirm}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#ff4d4d" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Submit */}
          {loading ? (
            <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 8 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Create account</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          )}

        </View>

        {/* Login link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#2a2a4e",
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: "#666",
  },
  card: {
    backgroundColor: "#141420",
    borderRadius: 24,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: "#1e1e30",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#aaaaaa",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f18",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222235",
    paddingHorizontal: 14,
    gap: 10,
  },
  inputIcon: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    paddingVertical: 14,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2a0f0f",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ff4d4d30",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 13,
    flex: 1,
  },
  button: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#555",
    fontSize: 14,
  },
  footerLink: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "700",
  },
});