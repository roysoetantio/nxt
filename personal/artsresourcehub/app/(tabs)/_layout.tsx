import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs, type NativeTabsBlurEffect } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

const IOS_VERSION = Platform.OS === 'ios' ? parseInt(String(Platform.Version), 10) : 0;
const TAB_BLUR_EFFECT: NativeTabsBlurEffect = IOS_VERSION >= 26 ? 'systemUltraThinMaterial' : 'systemChromeMaterial';

function WebTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabsIconFallback name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="documentary"
        options={{
          title: 'Film',
          tabBarIcon: ({ color, size }) => (
            <TabsIconFallback name="film" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning',
          tabBarIcon: ({ color, size }) => (
            <TabsIconFallback name="book" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ color, size }) => (
            <TabsIconFallback name="document-text" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Evaluation',
          tabBarIcon: ({ color, size }) => (
            <TabsIconFallback name="clipboard" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function MobileNativeTabsLayout() {
  return (
    <NativeTabs
      labelStyle={{ fontSize: 11 }}
      blurEffect={TAB_BLUR_EFFECT}
      disableTransparentOnScrollEdge
      minimizeBehavior="never">
      <NativeTabs.Trigger name="home">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="documentary">
        <Icon sf={{ default: 'film', selected: 'film.fill' }} />
        <Label>Film</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="learning">
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Learning</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="guides">
        <Icon sf={{ default: 'doc.text', selected: 'doc.text.fill' }} />
        <Label>Guides</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: 'checkmark.circle', selected: 'checkmark.circle.fill' }} />
        <Label>Evaluation</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function TabsIconFallback({ name, color, size }: {
  name: 'home' | 'film' | 'book' | 'document-text' | 'clipboard';
  color: string;
  size: number;
}) {
  return <Ionicons name={name} color={color} size={size} />;
}

export default function TabsLayout() {
  if (Platform.OS === 'web') return <WebTabsLayout />;
  return <MobileNativeTabsLayout />;
}
