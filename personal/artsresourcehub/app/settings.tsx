import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  ChevronLeftIcon,
  CheckIcon,
  ExternalLinkIcon,
  FacebookIcon,
  HeartIcon,
  InfoIcon,
  UsersIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable } from 'react-native';
import { Linking, ScrollView, View } from 'react-native';

type LanguageOption = '繁體' | '简体' | 'English';
type TextSizeOption = 'Small' | 'Medium' | 'Large';

const FACEBOOK_URL = 'https://www.facebook.com/CUHKartandaging';
const ABOUT_US_URL = {
  '繁體': 'https://cu-artsresource.org/aboutus/',
  '简体': 'https://cu-artsresource.org/sc/aboutus-sc/',
  English: 'https://cu-artsresource.org/aboutus/',
} as const;
const PROJECT_TEAM_URL = {
  '繁體': 'https://cu-artsresource.org/project-team/',
  '简体': 'https://cu-artsresource.org/project-team-sc/',
  English: 'https://cu-artsresource.org/project-team/',
} as const;
const COLLABORATE_URL = {
  '繁體': 'https://cu-artsresource.org/collaborate/',
  '简体': 'https://cu-artsresource.org/collaborate-sc/',
  English: 'https://cu-artsresource.org/collaborate/',
} as const;
const SECTION_BG = '#F6F6F6';
const SELECTED_BG = '#D7EBF6';

const COPY = {
  English: {
    title: 'Settings',
    languageHeader: 'LANGUAGE',
    textSizeHeader: 'TEXT SIZE',
    aboutHeader: 'ABOUT US',
    textSize: ['Small', 'Medium', 'Large'] as const,
    aboutUs: 'About Us',
    projectTeam: 'Project Team',
    collaborate: 'Collaborate',
    facebook: 'Facebook',
    footer: 'App Version 1.0.0\nDepartment of Cultural Studies, CUHK\nArts and Ageing Programme',
  },
  '繁體': {
    title: '設定',
    languageHeader: '語言',
    textSizeHeader: '文字大小',
    aboutHeader: '關於我們',
    textSize: ['小', '中', '大'] as const,
    aboutUs: '關於我們',
    projectTeam: '項目團隊',
    collaborate: '協作',
    facebook: 'Facebook',
    footer: 'App Version 1.0.0\nDepartment of Cultural Studies, CUHK\nArts and Ageing Programme',
  },
  '简体': {
    title: '设置',
    languageHeader: '语言',
    textSizeHeader: '文字大小',
    aboutHeader: '关于我们',
    textSize: ['小', '中', '大'] as const,
    aboutUs: '关于我们',
    projectTeam: '项目团队',
    collaborate: '协作',
    facebook: 'Facebook',
    footer: 'App Version 1.0.0\nDepartment of Cultural Studies, CUHK\nArts and Ageing Programme',
  },
} as const;

export default function SettingsScreen() {
  const router = useRouter();
  const [language, setLanguage] = React.useState<LanguageOption>('English');
  const [textSize, setTextSize] = React.useState<TextSizeOption>('Small');
  const copy = COPY[language];
  const textSizeLabels = copy.textSize;
  const fontSizeClass =
    textSize === 'Small' ? 'text-base' : textSize === 'Medium' ? 'text-lg' : 'text-xl';
  const headingSizeClass =
    textSize === 'Small' ? 'text-2xl' : textSize === 'Medium' ? 'text-[28px]' : 'text-[32px]';

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="p-4 pt-12">
          <View className="mb-4 flex-row items-center">
            <Button size="icon" variant="ghost" onPress={() => router.back()}>
              <Icon as={ChevronLeftIcon} className="size-6 text-foreground" />
            </Button>
            <Text className={`ml-1 font-tc font-tc-bold text-foreground ${headingSizeClass}`}>{copy.title}</Text>
          </View>

          <Text className="mb-2 font-tc text-sm tracking-wider text-muted-foreground">{copy.languageHeader}</Text>
          <View className="overflow-hidden rounded-3xl" style={{ backgroundColor: SECTION_BG }}>
            {(['繁體', '简体', 'English'] as const).map((option, index) => {
              const selected = language === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setLanguage(option)}
                  style={{ backgroundColor: selected ? SELECTED_BG : 'transparent' }}
                  className="min-h-16 flex-row items-center justify-between px-4">
                  <Text className={`font-tc ${fontSizeClass} ${selected ? 'font-tc-bold text-arh-blue' : 'text-foreground'}`}>
                    {option}
                  </Text>
                  {selected ? <Icon as={CheckIcon} className="size-6 text-arh-blue" /> : <View className="size-6" />}
                  {index < 2 ? (
                    <View className="absolute bottom-0 left-4 right-4 border-b border-border" />
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Text className="mb-2 mt-6 font-tc text-sm tracking-wider text-muted-foreground">{copy.textSizeHeader}</Text>
          <View className="rounded-3xl p-2" style={{ backgroundColor: SECTION_BG }}>
            <View className="flex-row gap-2">
              {(['Small', 'Medium', 'Large'] as const).map((option, index) => (
                <Pressable
                  key={option}
                  onPress={() => setTextSize(option)}
                  className="flex-1 items-center justify-center rounded-3xl py-4"
                  style={{ backgroundColor: textSize === option ? SELECTED_BG : 'transparent' }}>
                  <Text
                    className={`font-tc ${fontSizeClass} ${textSize === option ? 'font-tc-bold text-arh-blue' : 'font-tc-semibold text-muted-foreground'}`}>
                    {textSizeLabels[index]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Text className="mb-2 mt-6 font-tc text-sm tracking-wider text-muted-foreground">{copy.aboutHeader}</Text>
          <View className="overflow-hidden rounded-3xl" style={{ backgroundColor: SECTION_BG }}>
            <AboutRow
              title={copy.aboutUs}
              icon={InfoIcon}
              textSizeClass={fontSizeClass}
              onPress={() => void Linking.openURL(ABOUT_US_URL[language])}
            />
            <AboutRow
              title={copy.projectTeam}
              icon={UsersIcon}
              textSizeClass={fontSizeClass}
              onPress={() => void Linking.openURL(PROJECT_TEAM_URL[language])}
            />
            <AboutRow
              title={copy.collaborate}
              icon={HeartIcon}
              textSizeClass={fontSizeClass}
              onPress={() => void Linking.openURL(COLLABORATE_URL[language])}
            />
            <AboutRow
              title={copy.facebook}
              icon={FacebookIcon}
              textSizeClass={fontSizeClass}
              onPress={() => void Linking.openURL(FACEBOOK_URL)}
            />
          </View>

          <View className="mt-8 items-center">
            <Text className="text-center font-tc text-xs text-muted-foreground">{copy.footer}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function AboutRow({
  title,
  icon,
  textSizeClass,
  onPress,
}: {
  title: string;
  icon: React.ComponentType<any>;
  textSizeClass: string;
  onPress?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className="h-16 w-full flex-row items-center justify-between px-4"
      onPress={onPress}>
      <View className="flex-row items-center gap-4">
        <Icon as={icon as any} className="size-7 text-muted-foreground" />
        <Text className={`font-tc text-foreground ${textSizeClass}`}>{title}</Text>
      </View>
      <Icon as={ExternalLinkIcon} className="size-6 text-muted-foreground" />
      {title !== 'Facebook' ? (
        <View className="absolute bottom-0 left-4 right-4 border-b border-border" />
      ) : null}
    </Button>
  );
}
