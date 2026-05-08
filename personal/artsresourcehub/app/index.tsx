import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Asset } from 'expo-asset';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { Image, View } from 'react-native';

const TWINS = require('@/assets/images/characters/Twins01.webp');
const LOGO = require('@/assets/images/logo.png');

const LANGUAGES = [
  {
    key: 'tc',
    label: '繁體中文',
    fontClass: 'font-tc',
    message: '你好，歡迎來到藝術資源庫。我哋想同你一齊慢慢欣賞藝術。請問你想用邊一種語言？',
  },
  {
    key: 'en',
    label: 'English',
    fontClass: '',
    message:
      'Hello, welcome to Arts Resource Hub. We would like to enjoy art slowly together with you. Which language would you like to use?',
  },
] as const;

type LanguageKey = (typeof LANGUAGES)[number]['key'];

export default function LanguageGate() {
  const router = useRouter();
  const [language, setLanguage] = React.useState<LanguageKey>('tc');
  const [autoRotate, setAutoRotate] = React.useState(true);

  const logoAsset = Asset.fromModule(LOGO);
  const twinsAsset = Asset.fromModule(TWINS);
  const logoWidth = 200;
  const twinsWidth = 300;
  const logoHeight =
    logoAsset?.width && logoAsset?.height ? logoWidth * (logoAsset.height / logoAsset.width) : 200;
  const twinsHeight =
    twinsAsset?.width && twinsAsset?.height
      ? twinsWidth * (twinsAsset.height / twinsAsset.width)
      : 200;

  React.useEffect(() => {
    if (!autoRotate) {
      return undefined;
    }

    const interval = setInterval(() => {
      setLanguage((current) => (current === 'tc' ? 'en' : 'tc'));
    }, 6000);

    return () => clearInterval(interval);
  }, [autoRotate]);

  const activeLanguage = LANGUAGES.find((item) => item.key === language) ?? LANGUAGES[0];

  const handleSelect = (key: LanguageKey) => {
    setLanguage(key);
    setAutoRotate(false);
    if (key === 'en') {
      router.push('/(tabs)/home');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background px-6 pb-10 pt-16">
        <View className="flex-1 justify-between gap-8">
          <View className="items-center gap-6">
            <Image source={LOGO} style={{ width: logoWidth, height: logoHeight }} resizeMode="contain" />
            <Image
              source={TWINS}
              style={{ width: twinsWidth, height: twinsHeight }}
              className="rounded-3xl"
              resizeMode="cover"
            />
            <Text
              variant="h3"
              className={cn('text-center text-foreground', activeLanguage.fontClass)}>
              {activeLanguage.message}
            </Text>
          </View>
          <View className="gap-3">
            {LANGUAGES.map((option) => (
              <Button
                key={option.key}
                variant={language === option.key ? 'default' : 'outline'}
                className="w-full"
                onPress={() => handleSelect(option.key)}>
                <Text className={option.fontClass}>{option.label}</Text>
              </Button>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}
