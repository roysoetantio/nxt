import * as React from 'react';
import { Image, Linking, Pressable, View } from 'react-native';

type VideoCardProps = {
  source: string | { uri?: string } | null | undefined;
  poster: any;
};

export function VideoCard({ source, poster }: VideoCardProps) {
  const handlePress = async () => {
    const uri = typeof source === 'string' ? source : source?.uri;
    if (uri) await Linking.openURL(uri);
  };

  return (
    <Pressable onPress={handlePress} className="w-full">
      <View className="w-full overflow-hidden rounded-2xl" style={{ aspectRatio: 16 / 9 }}>
        <Image source={poster as never} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </View>
    </Pressable>
  );
}
