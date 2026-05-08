import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VideoCard } from '@/components/ui/video-card';
import { useBookmarks } from '@/lib/bookmarks';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowUpRightIcon, BookmarkIcon, SettingsIcon } from 'lucide-react-native';
import * as React from 'react';
import { Animated, Dimensions, Image, Linking, PanResponder, Platform, Pressable, ScrollView, View } from 'react-native';

const AVATAR = require('@/assets/images/characters/avatar/avatar05.jpg');
const TOP_BG = require('@/assets/images/top-bg.jpg');
const TOP_BG_SOURCE =
  typeof Image.resolveAssetSource === 'function' ? Image.resolveAssetSource(TOP_BG) : null;
const TOP_BG_ASPECT_RATIO =
  TOP_BG_SOURCE?.width && TOP_BG_SOURCE?.height
    ? TOP_BG_SOURCE.width / TOP_BG_SOURCE.height
    : 16 / 9;

const SECTION_1_VIDEOS = [
  {
    id: 'A-01',
    category: 'Documentary' as const,
    title: '媛媛的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-媛媛的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-01-th.jpg'),
  },
  {
    id: 'A-02',
    category: 'Documentary' as const,
    title: 'Happy的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-Happy的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-02-th.jpg'),
  },
  {
    id: 'A-03',
    category: 'Documentary' as const,
    title: '阿Ling的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-阿Ling的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-03-th.jpg'),
  },
  {
    id: 'A-04',
    category: 'Documentary' as const,
    title: 'Patrick的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-Patrick的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-04-th.jpg'),
  },
  {
    id: 'A-05',
    category: 'Documentary' as const,
    title: '朱朱的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-朱朱的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-05-th.jpg'),
  },
  {
    id: 'A-06',
    category: 'Documentary' as const,
    title: 'Rosaline的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-Rosaline的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-06-th.jpg'),
  },
  {
    id: 'A-07',
    category: 'Documentary' as const,
    title: 'Mango的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-Mango的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-07-th.jpg'),
  },
  {
    id: 'A-08',
    category: 'Documentary' as const,
    title: '友安的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-友安的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-08-th.jpg'),
  },
  {
    id: 'A-09',
    category: 'Documentary' as const,
    title: '雯雯的故事 (2024)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-雯雯的故事-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-09-th.jpg'),
  },
] as const;

const SECTION_2_VIDEOS = [
  {
    id: 'B-01',
    category: 'Documentary' as const,
    title: '陳美英的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Dance-1-陳美英的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/B-01-th.jpg'),
  },
  {
    id: 'B-02',
    category: 'Documentary' as const,
    title: 'Emma的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-OtherArtForms-1-Emma的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/B-02-th.jpg'),
  },
  {
    id: 'B-03',
    category: 'Documentary' as const,
    title: 'Cindy的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Music-3-Cindy的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/B-03-th.jpg'),
  },
  {
    id: 'B-04',
    category: 'Documentary' as const,
    title: 'Jenny的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Music-4-Jenny的故事-2.mp4',
    thumb: require('@/assets/videos/01-documentary/B-04-th.jpg'),
  },
  {
    id: 'B-05',
    category: 'Documentary' as const,
    title: '羅玉娟的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Music-7-陳KC的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/B-05-th.jpg'),
  },
] as const;

const SECTION_3_VIDEOS = [
  {
    id: 'C-01',
    category: 'Documentary' as const,
    title: 'Maggie的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Drama-1-Maggie的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/C-01-th.jpg'),
  },
  {
    id: 'C-02',
    category: 'Documentary' as const,
    title: '杜杜的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Drama-2-杜杜的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/C-02-th.jpg'),
  },
] as const;

const SECTION_4_VIDEOS = [
  {
    id: 'D-01',
    category: 'Documentary' as const,
    title: '夏KC的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Music-1-夏KC的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/D-01-th.jpg'),
  },
  {
    id: 'D-02',
    category: 'Documentary' as const,
    title: '黃生的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Music-2-黃生的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/D-02-th.jpg'),
  },
  {
    id: 'D-03',
    category: 'Documentary' as const,
    title: '陳KC的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Music-5-羅玉娟的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/D-03-th.jpg'),
  },
  {
    id: 'D-04',
    category: 'Documentary' as const,
    title: '曾玉琪的故事 (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Music-6-曾玉琪的故事.mp4',
    thumb: require('@/assets/videos/01-documentary/D-04-th.jpg'),
  },
] as const;

const LEARNING_SECTIONS = [
  {
    id: 'section-1',
    title: '中大戲劇工作坊老友「紀」',
    description:
      '藝術與年長項目針對大埔區長者，舉辦了兩場戲劇工作坊及展演，包括一場「一人一故事」劇場類型的工作坊。之後製作了9部紀錄短片，展示兩個戲劇工作坊其中9位老友记參與藝術的故事。',
    videos: SECTION_1_VIDEOS,
  },
  {
    id: 'section-2',
    title: '社區文化發展中心老友「紀」',
    description:
      '藝術與年長項目製作了5部紀錄短片，展示5位老友記參加社區文化發展中心項目的故事。',
    videos: SECTION_2_VIDEOS,
  },
  {
    id: 'section-3',
    title: '長智戲老友「紀」',
    description:
      '藝術與年長項目製作了2部紀錄短片，展示2位老友記參加Arts’ Options「長智戲」項目的故事。',
    videos: SECTION_3_VIDEOS,
  },
  {
    id: 'section-4',
    title: '五十男樂團老友「紀」',
    description:
      '藝術與年長項目製作了4部紀錄短片，展示4位老友記參加五十男樂團項目的故事。',
    videos: SECTION_4_VIDEOS,
  },
] as const;

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MIN_Y = 8;
const SHEET_MAX_LIMIT = Math.min(520, SCREEN_HEIGHT * 0.7);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function fireSheetHaptic() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export default function LearningScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const translateY = React.useRef(new Animated.Value(SHEET_MIN_Y)).current;
  const handleBounce = React.useRef(new Animated.Value(0)).current;
  const bounceLoopRef = React.useRef<Animated.CompositeAnimation | null>(null);
  const offsetRef = React.useRef(SHEET_MIN_Y);
  const contentScrollYRef = React.useRef(0);
  const [webSheetTop, setWebSheetTop] = React.useState(SHEET_MIN_Y);
  const [areaAHeight, setAreaAHeight] = React.useState(340);
  const [isAreaAOpen, setIsAreaAOpen] = React.useState(false);
  const facebookUrl = 'https://www.facebook.com/CUHKartandaging';
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const sheetMaxY = React.useMemo(
    () => clamp(areaAHeight + 32, SHEET_MIN_Y + 40, SHEET_MAX_LIMIT),
    [areaAHeight]
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          if (Math.abs(gesture.dy) <= 4 || Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
            return false;
          }
          if (offsetRef.current > SHEET_MIN_Y) {
            return true;
          }
          return gesture.dy > 0 && contentScrollYRef.current <= 0;
        },
        onPanResponderMove: (_, gesture) => {
          const next = clamp(offsetRef.current + gesture.dy, SHEET_MIN_Y, sheetMaxY);
          setIsAreaAOpen(next > SHEET_MIN_Y + 1);
          translateY.setValue(next);
        },
        onPanResponderRelease: (_, gesture) => {
          const next = clamp(offsetRef.current + gesture.dy, SHEET_MIN_Y, sheetMaxY);
          const midpoint = SHEET_MIN_Y + (sheetMaxY - SHEET_MIN_Y) / 2;
          const snapTo = next > midpoint ? sheetMaxY : SHEET_MIN_Y;
          setIsAreaAOpen(snapTo > SHEET_MIN_Y);
          if (offsetRef.current !== snapTo) {
            fireSheetHaptic();
          }
          offsetRef.current = snapTo;
          Animated.spring(translateY, {
            toValue: snapTo,
            useNativeDriver: true,
            damping: 18,
            stiffness: 180,
            mass: 0.7,
          }).start();
        },
      }),
    [sheetMaxY, translateY]
  );

  const snapSheet = React.useCallback(
    (openAreaA: boolean) => {
      const target = openAreaA ? sheetMaxY : SHEET_MIN_Y;
      if (isAreaAOpen !== openAreaA) {
        fireSheetHaptic();
      }
      setIsAreaAOpen(openAreaA);
      offsetRef.current = target;
      if (isWeb) {
        setWebSheetTop(target);
      } else {
        Animated.spring(translateY, {
          toValue: target,
          useNativeDriver: true,
          damping: 18,
          stiffness: 180,
          mass: 0.7,
        }).start();
      }
    },
    [isAreaAOpen, isWeb, sheetMaxY, translateY]
  );

  React.useEffect(() => {
    if (!isAreaAOpen) {
      bounceLoopRef.current?.stop();
      bounceLoopRef.current = null;
      handleBounce.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(handleBounce, {
          toValue: 6,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(handleBounce, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }),
      ])
    );

    bounceLoopRef.current = loop;
    loop.start();

    return () => {
      bounceLoopRef.current?.stop();
      bounceLoopRef.current = null;
      handleBounce.setValue(0);
    };
  }, [handleBounce, isAreaAOpen]);

  const sheetContent = (
    <View className={`flex-1 rounded-t-[32px] border border-border ${isAreaAOpen ? 'bg-greyBG' : 'bg-white'}`}>
      <View className="absolute left-0 right-0 top-3 z-10 items-center">
        <Pressable onPress={isWeb ? () => snapSheet(!isAreaAOpen) : undefined} className="">
          <Animated.View style={{ transform: [{ translateY: handleBounce }] }}>
            <View className="h-1.5 w-16 rounded-full bg-black/20" />
          </Animated.View>
        </Pressable>
      </View>
      <ScrollView

        className="flex-1"
        scrollEnabled={!isAreaAOpen}
        bounces
        alwaysBounceVertical={Platform.OS === 'ios'}
        onScroll={({ nativeEvent }) => {
          contentScrollYRef.current = nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 40, paddingHorizontal: 20, paddingBottom: 128 }}
        style={{ opacity: isAreaAOpen ? 0.58 : 1 }}>
        {LEARNING_SECTIONS.map((section) => (
          <View key={section.id} className="pb-10">
            <Text className="font-tc text-[28px] font-tc-bold text-foreground pb-2">{section.title}</Text>
            <Text className="font-tc text-base text-muted-foreground pb-8">{section.description}</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-5"
              contentContainerStyle={{ paddingHorizontal: 20 }}>
              {section.videos.map((film, index) => (
                <View
                  key={film.id}
                  className={`w-64 ${index === section.videos.length - 1 ? '' : 'mr-4'}`}>
                  <VideoCard source={{ uri: film.videoUri }} poster={film.thumb} />
                  <View className="mt-2 flex-row items-center gap-2">
                    <Text className="flex-1 text-m text-foreground">{film.title}</Text>
                    {(() => {
                      const bookmarked = isBookmarked(film.id);
                      return (
                        <Pressable
                          onPress={() => {
                            if (Platform.OS !== 'web') {
                              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                            toggleBookmark({
                              id: film.id,
                              title: film.title,
                              videoUri: film.videoUri,
                              thumb: film.thumb,
                              sourcePage: 'Learning Materials',
                              sourceSection: section.title,
                            });
                          }}
                          className="h-8 w-8 items-center justify-center rounded-full bg-muted/60">
                          <Icon
                            as={BookmarkIcon}
                            className={`size-4 ${bookmarked ? 'text-arh-amber' : 'text-foreground'}`}
                            fill={bookmarked ? '#DEA202' : 'transparent'}
                          />
                        </Pressable>
                      );
                    })()}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const handleOpenFacebook = React.useCallback(() => {
    void Linking.openURL(facebookUrl);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <Image
        source={TOP_BG}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: undefined,
          aspectRatio: TOP_BG_ASPECT_RATIO,
        }}
      />
      <View className="px-5 pb-2 pt-20">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 overflow-hidden rounded-full bg-muted">
              <Image source={AVATAR} style={{ width: 48, height: 48 }} resizeMode="cover" />
            </View>
            <Text className="font-tc text-xl font-tc-bold text-foreground">藝術老友「紀」</Text>
          </View>
          <Button size="icon" variant="ghost" onPress={() => router.push('/settings')}>
            <Icon as={SettingsIcon} className="size-5" />
          </Button>
        </View>
      </View>

      <View className="relative flex-1">
        <View className="absolute left-0 right-0 top-0 px-5" onLayout={(event) => setAreaAHeight(event.nativeEvent.layout.height)}>
          <View className="mt-5 relative">
            <Text className="font-tc text-base leading-6 text-foreground">
              嘿，大家好！我係阿紀！
              {'\n\n'}
              我一直都好相信故事嘅力量，尤其係點樣可以激勵到咁多人！所以呢，我喺度整理咗一系列講長者藝術旅程嘅短片！ 無論係咩類型嘅藝術，你都會發現藝術創作係每個人都可以參與㗎！
              {'\n\n'}
              其實呢，呢啲影片已經鼓舞咗好多長者，令佢哋勇敢踏出藝術創作嘅第一步！快啲撳入去睇下啦，睇完記得分享俾你身邊嘅老友記！話唔定，下次主角就係你喇！ 仲有，記得去我哋嘅Facebook專頁睇多啲精彩內容，我會喺嗰度分享同記錄所有關於長者藝術嘅項目：
              {'\n\n'}
              期待你嘅回應呀！
            </Text>
            <Button
              onPress={handleOpenFacebook}
              variant="default"
              className="mt-4 h-11 w-full flex-row items-center justify-between rounded-xl px-4">
              <Text className="font-tc text-sm">CUHK Art and Aging @ Facebook</Text>
              <Icon as={ArrowUpRightIcon} className="ml-auto size-4 text-white" />
            </Button>
          </View>
        </View>

        {isWeb ? (
          <View style={{ top: webSheetTop }} className="absolute bottom-0 left-0 right-0">
            {sheetContent}
          </View>
        ) : (
          <Animated.View
            style={{ transform: [{ translateY }] }}
            {...panResponder.panHandlers}
            className="absolute bottom-0 left-0 right-0 top-0">
            {sheetContent}
          </Animated.View>
        )}
      </View>
    </View>
  );
}
