import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VideoCard } from '@/components/ui/video-card';
import { getBookmarkTagTone } from '@/lib/bookmark-tag';
import { useBookmarks } from '@/lib/bookmarks';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BookmarkIcon, ChevronLeftIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, View } from 'react-native';

const TOP_BG = require('@/assets/images/top-bg.jpg');
const TOP_BG_SOURCE =
  typeof Image.resolveAssetSource === 'function' ? Image.resolveAssetSource(TOP_BG) : null;
const TOP_BG_ASPECT_RATIO =
  TOP_BG_SOURCE?.width && TOP_BG_SOURCE?.height
    ? TOP_BG_SOURCE.width / TOP_BG_SOURCE.height
    : 16 / 9;

export default function BookmarkScreen() {
  const router = useRouter();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [isScrolled, setIsScrolled] = React.useState(false);

  const handleUnbookmark = React.useCallback(
    (item: (typeof bookmarks)[number]) => {
      if (Platform.OS !== 'web') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      toggleBookmark(item);
    },
    [toggleBookmark]
  );

  return (
    <View className="flex-1 bg-background">
      <Image
        source={TOP_BG}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 0,
          left: -2,
          right: -2,
          width: undefined,
          height: undefined,
          aspectRatio: TOP_BG_ASPECT_RATIO,
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 116, paddingBottom: 56 }}
        onScroll={({ nativeEvent }) => {
          const next = nativeEvent.contentOffset.y > 8;
          if (next !== isScrolled) {
            setIsScrolled(next);
          }
        }}
        scrollEventThrottle={16}>
        <View className="px-5">
          {bookmarks.length > 0 ? (
            <View className="gap-8">
              {bookmarks.map((item) => (
                (() => {
                  const tagTone = getBookmarkTagTone(item.sourcePage);
                  return (
                    <View key={item.id}>
                      <VideoCard source={{ uri: item.videoUri }} poster={item.thumb} />
                      <View className="mt-2 flex-row items-center gap-2">
                        <Text className="flex-1 text-base text-foreground">{item.title}</Text>
                        <Pressable
                          onPress={() => handleUnbookmark(item)}
                          className="h-8 w-8 items-center justify-center rounded-full bg-muted/60">
                          <Icon as={BookmarkIcon} className="size-4 text-arh-amber" fill="#DEA202" />
                        </Pressable>
                      </View>
                      <View
                        className={`mt-1 max-w-full self-start rounded-full px-2 py-0.5 ${tagTone === 'documentary'
                          ? 'bg-arh-blue-light'
                          : tagTone === 'learning'
                            ? 'bg-arh-green-light'
                            : tagTone === 'guides'
                              ? 'bg-arh-amber-light'
                              : tagTone === 'evaluation'
                                ? 'bg-arh-red-light'
                                : 'bg-muted'
                          }`}>
                        <Text numberOfLines={1} ellipsizeMode="tail" className="max-w-[220px] text-xs text-foreground">
                          {[item.sourcePage, item.sourceSection].filter(Boolean).join(' · ') || 'Unknown'}
                        </Text>
                      </View>
                    </View>
                  );
                })()
              ))}
            </View>
          ) : (
            <View className="rounded-2xl border border-dashed border-border bg-card px-4 py-6">
              <Text className="text-sm text-muted-foreground">
                Bookmark videos and they will appear here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute left-0 right-0 top-0 px-5 pb-6 pt-14">
        {isScrolled ? (
          <GlassCard
            intensity={62}
            variant="light"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 0,
            }}
          />
        ) : null}
        <View className="flex-row items-center justify-between">
          <Button size="icon" variant="ghost" onPress={() => router.back()}>
            <Icon as={ChevronLeftIcon} className="size-7" />
          </Button>
          <Text numberOfLines={1} className="ml-1 flex-1 text-left font-tc text-xl font-tc-bold text-foreground">
            {bookmarks.length > 0 ? `Bookmarks (${bookmarks.length})` : 'Bookmark'}
          </Text>
          <View className="h-9 w-9" />
        </View>
      </View>
    </View>
  );
}

