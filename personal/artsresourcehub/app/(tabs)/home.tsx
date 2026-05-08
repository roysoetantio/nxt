import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Icon } from '@/components/ui/icon';
import { VideoCard } from '@/components/ui/video-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { getBookmarkTagTone } from '@/lib/bookmark-tag';
import { useBookmarks } from '@/lib/bookmarks';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import {
  BookmarkIcon,
  ChevronRightIcon,
  CloudIcon,
  CloudRainIcon,
  ImageIcon,
  SettingsIcon,
  SunIcon,
  XIcon,
} from 'lucide-react-native';
import {
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  UIManager,
  View,
} from 'react-native';
import * as React from 'react';

const USER_NAME = 'Lim';
const DEFAULT_CITY = 'Kuala Lumpur';
const TOP_BG = require('@/assets/images/top-bg.jpg');
const TOP_BG_SOURCE =
  typeof Image.resolveAssetSource === 'function' ? Image.resolveAssetSource(TOP_BG) : null;
const TOP_BG_ASPECT_RATIO =
  TOP_BG_SOURCE?.width && TOP_BG_SOURCE?.height
    ? TOP_BG_SOURCE.width / TOP_BG_SOURCE.height
    : 16 / 9;

type DaySlot =
  | 'morningEarly'
  | 'morningLate'
  | 'afternoonEarly'
  | 'afternoonLate'
  | 'eveningEarly'
  | 'eveningLate'
  | 'night';

type WeatherPeriod = 'morning' | 'afternoon' | 'evening' | 'night';
type NearbySeniorCenter = {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  mapQuery: string;
  photoUri?: string;
  category: 'centres' | 'community' | 'residential';
  openNow?: boolean;
};

const GREETINGS: Record<DaySlot, string[]> = {
  morningEarly: [
    'Good morning, <user>. Have you had your breakfast?',
    'Good morning, <user>. A warm drink and a light stretch could feel nice.',
    'Good morning, <user>. Take your time and start the day gently.',
    'Good morning, <user>. A short walk or simple exercise can help you feel fresh.',
    'Good morning, <user>. Remember to drink some water before you begin your day.',
    "Good morning, <user>. Today is a new day-we're here to spend it with you.",
    'Good morning, <user>. A calm start can make the whole day feel lighter.',
    'Good morning, <user>. If you feel stiff, a gentle shoulder roll may help.',
    'Good morning, <user>. Open the curtains and welcome a little sunlight.',
    'Good morning, <user>. One small step this morning is already good progress.',
    'Good morning, <user>. Let us begin today at a comfortable pace.',
  ],
  morningLate: [
    'Good morning, <user>. Hope your morning has been going smoothly.',
    'Good morning, <user>. This is a good time for a light snack if you need energy.',
    'Good morning, <user>. A short pause now can help your noon feel easier.',
    'Good morning, <user>. If you have plans today, one simple step is enough to begin.',
    'Good morning, <user>. Keep some water nearby and sip slowly.',
    'Good morning, <user>. Let us carry this calm pace into the rest of the day.',
    'Good morning, <user>. A few deep breaths can help you reset your focus.',
    'Good morning, <user>. You are already doing well today, keep it gentle.',
    'Good morning, <user>. A little music can make this part of the day feel lighter.',
    'Good morning, <user>. Take care of your eyes and rest them for a moment.',
    'Good morning, <user>. Thank you for checking in with us this morning.',
  ],
  afternoonEarly: [
    'Good afternoon, <user>. Have you had your lunch yet?',
    'Good afternoon, <user>. This might be a good time to rest your eyes for a few minutes.',
    'Good afternoon, <user>. Remember to drink some water and keep yourself hydrated.',
    'Good afternoon, <user>. How about enjoying a little art or music to relax?',
    'Good afternoon, <user>. If you feel tired, a short break can help your body recover.',
    "Good afternoon, <user>. You're doing well-take today step by step.",
    'Good afternoon, <user>. A short pause can help you recharge for the rest of the day.',
    'Good afternoon, <user>. If you are seated for long, try standing for one minute.',
    'Good afternoon, <user>. A little fresh air can help clear your mind.',
    'Good afternoon, <user>. Keep your pace gentle and steady, you are doing fine.',
    'Good afternoon, <user>. Maybe play one favorite song to lift your mood.',
  ],
  afternoonLate: [
    'Good afternoon, <user>. The day is moving along, how are you feeling now?',
    'Good afternoon, <user>. If you feel low on energy, a short rest can help.',
    'Good afternoon, <user>. This is a nice time to stretch your back and shoulders.',
    'Good afternoon, <user>. A warm drink may help you feel more comfortable.',
    'Good afternoon, <user>. You can slow down a little as evening gets closer.',
    'Good afternoon, <user>. Keep hydrated and stay kind to yourself.',
    'Good afternoon, <user>. If possible, step away from the screen for a minute.',
    'Good afternoon, <user>. Small progress is still progress, you are doing great.',
    'Good afternoon, <user>. A calm rhythm now can make tonight feel easier.',
    'Good afternoon, <user>. Thank you for spending this part of the day with us.',
    'Good afternoon, <user>. Let us finish the afternoon gently and steadily.',
  ],
  eveningEarly: [
    'Good evening, <user>. Have you had your dinner?',
    "Good evening, <user>. You've done your best today-now it's time to relax.",
    'Good evening, <user>. A warm drink and some quiet time can help you unwind.',
    'Good evening, <user>. Take a moment to stretch gently and loosen your body.',
    'Good evening, <user>. How about enjoying a little art or music to relax?',
    'Good evening, <user>. A slow walk can help your body settle after the day.',
    'Good evening, <user>. Keep warm and give yourself a little quiet time.',
    'Good evening, <user>. You can do one small thing now and leave the rest for tomorrow.',
    'Good evening, <user>. A light snack and water may help you feel better.',
    'Good evening, <user>. Thank you for staying with us this evening.',
  ],
  eveningLate: [
    'Good evening, <user>. Have you had your dinner?',
    "Good evening, <user>. You've done your best today-now it's time to relax.",
    'Good evening, <user>. Maybe enjoy a short story or programme before bed.',
    'Good evening, <user>. Try to avoid heavy food too late, so you can sleep better.',
    'Good evening, <user>. A warm drink and some quiet time can help you unwind.',
    'Good evening, <user>. Take a moment to stretch gently and loosen your body.',
    'Good evening, <user>. A gentle bedtime routine can help you sleep more easily.',
    'Good evening, <user>. If your mind is busy, take a few slow breaths.',
    'Good evening, <user>. Keep the room calm and dim for a better rest.',
    'Good evening, <user>. A little reading can help the day end softly.',
    'Good evening, <user>. You have done enough for today, rest is important too.',
  ],
  night: [
    "Good night, <user>. It's getting late-time to rest and take care of yourself.",
    'Good night, <user>. Thank you for spending some time with us today.',
    'Good night, <user>. A good sleep will help you feel stronger tomorrow.',
    'Good night, <user>. Try to put your phone down and let your eyes relax.',
    'Good night, <user>. Breathe slowly, relax your body, and have a peaceful sleep.',
    "Good night, <user>. If you can't sleep, a few calm breaths may help you feel better.",
    'Good night, <user>. Let your shoulders drop and your body rest naturally.',
    'Good night, <user>. A quiet room and slow breathing can bring calm.',
    'Good night, <user>. Keep warm and make yourself comfortable for sleep.',
    'Good night, <user>. Tomorrow can wait, tonight is for rest.',
    'Good night, <user>. Wishing you a deep and peaceful sleep.',
  ],
};

const WEATHER_GREETINGS: Record<WeatherPeriod, { rain: string[]; hot: string[] }> = {
  morning: {
    rain: ['Good morning, <user>. It may rain later-take an umbrella if you go out.'],
    hot: ['Good morning, <user>. The weather looks sunny today-enjoy the light if you can.'],
  },
  afternoon: {
    rain: ['Good afternoon, <user>. Looks like it may rain-walk carefully if the ground is wet.'],
    hot: ["Good afternoon, <user>. It's sunny outside-if you go out, protect yourself from the sun.",],
  },
  evening: {
    rain: ["Good evening, <user>. It might rain tonight-close the windows if it gets windy."],
    hot: [],
  },
  night: {
    rain: ['Good night, <user>. It may rain overnight-stay warm and cozy indoors.'],
    hot: [],
  },
};

const AVATARS = [
  require('@/assets/images/characters/avatar/avatar01.jpg'),
  require('@/assets/images/characters/avatar/avatar02.jpg'),
  require('@/assets/images/characters/avatar/avatar03.jpg'),
  require('@/assets/images/characters/avatar/avatar04.jpg'),
  require('@/assets/images/characters/avatar/avatar05.jpg'),
] as const;

const SUGGESTED_CONTENT = [
  {
    id: 'A-Documentary-Workshops-01',
    category: 'Documentary',
    title: "Yuanyuan's Story (2024)",
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2025/03/CUHK-Workshops-%E5%AA%9B%E5%AA%9B%E7%9A%84%E6%95%85%E4%BA%8B-TC.mp4',
    thumb: require('@/assets/videos/01-documentary/A-01-th.jpg'),
  },
  {
    id: 'B-Documentary-Dance-01',
    category: 'Learning Materials',
    title: 'The Story of Chen Meiying (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Dance-1-%E9%99%B3%E7%BE%8E%E8%8B%B1%E7%9A%84%E6%95%85%E4%BA%8B.mp4',
    thumb: require('@/assets/videos/01-documentary/B-01-th.jpg'),
  },
  {
    id: 'C-Documentary-Drama-01',
    category: 'Guides',
    title: "Maggie's Story (2023)",
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Drama-1-Maggie%E7%9A%84%E6%95%85%E4%BA%8B.mp4',
    thumb: require('@/assets/videos/01-documentary/C-01-th.jpg'),
  },
  {
    id: 'D-Documentary-Music-01',
    category: 'Evaluation',
    title: 'The Story of Summer KC (2023)',
    videoUri: 'https://cu-artsresource.org/wp-content/uploads/2024/11/Documentary-Music-1-%E5%A4%8FKC%E7%9A%84%E6%95%85%E4%BA%8B.mp4',
    thumb: require('@/assets/videos/01-documentary/D-01-th.jpg'),
  },
] as const;

const ARTS_ACTIVITY_OPTIONS = [
  'Watched performance',
  'Joined workshop',
  'Created something',
  'Other',
] as const;

const CATEGORY_BADGE_COLOR = {
  Documentary: 'bg-arh-blue-light',
  'Learning Materials': 'bg-arh-green-light',
  Guides: 'bg-arh-amber-light',
  Evaluation: 'bg-arh-red-light',
} as const;

const SENIOR_CENTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'centres', label: 'Centres' },
  { key: 'community', label: 'Community' },
  { key: 'residential', label: 'Residential' },
] as const;
const SENIOR_PAGE_SIZE = 10;

export default function WelcomeScreen() {
  const router = useRouter();
  const avatarSource = React.useMemo(
    () => AVATARS[Math.floor(Math.random() * AVATARS.length)],
    []
  );
  const [weatherState, setWeatherState] = React.useState<{
    isRaining: boolean;
    isVeryHot: boolean;
    tempC: number;
    conditionText: string;
  } | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = React.useState(true);
  const [artsActivityAnswer, setArtsActivityAnswer] = React.useState<'yes' | 'no' | null>(null);
  const [artsActivityOption, setArtsActivityOption] = React.useState<
    (typeof ARTS_ACTIVITY_OPTIONS)[number] | null
  >(null);
  const [artsActivityCardState, setArtsActivityCardState] = React.useState<'form' | 'answered' | 'hidden'>(
    'form'
  );
  const [nearbySeniorCenters, setNearbySeniorCenters] = React.useState<NearbySeniorCenter[]>([]);
  const [isSeniorCentersLoading, setIsSeniorCentersLoading] = React.useState(false);
  const [seniorCentersError, setSeniorCentersError] = React.useState<string | null>(null);
  const [seniorCentersReloadTick, setSeniorCentersReloadTick] = React.useState(0);
  const [selectedSeniorTab, setSelectedSeniorTab] = React.useState<(typeof SENIOR_CENTER_TABS)[number]['key']>('all');
  const [visibleSeniorCount, setVisibleSeniorCount] = React.useState(SENIOR_PAGE_SIZE);
  const [seniorFetchDepth, setSeniorFetchDepth] = React.useState(1);
  const [hasMoreSeniorCenters, setHasMoreSeniorCenters] = React.useState(true);
  const [openNowOnly, setOpenNowOnly] = React.useState(false);
  const seniorListRef = React.useRef<ScrollView>(null);
  const { bookmarks, toggleBookmark } = useBookmarks();

  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const handleRemoveBookmark = React.useCallback(
    (film: (typeof bookmarks)[number]) => {
      if (Platform.OS !== 'web') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      toggleBookmark(film);
    },
    [toggleBookmark]
  );

  React.useEffect(() => {
    let isActive = true;

    const loadWeather = async () => {
      setIsWeatherLoading(true);
      const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setWeatherState(null);
        setIsWeatherLoading(false);
        return;
      }
      try {
        let latitude: number | null = null;
        let longitude: number | null = null;
        try {
          const permission = await Location.requestForegroundPermissionsAsync();
          if (permission.status === 'granted') {
            const position = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
          }
        } catch { }
        const weatherQuery =
          latitude !== null && longitude !== null
            ? `lat=${latitude}&lon=${longitude}`
            : `q=${encodeURIComponent(DEFAULT_CITY)}`;
        const url = `https://api.openweathermap.org/data/2.5/weather?${weatherQuery}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('OpenWeather request failed');
        }
        const data: {
          weather?: Array<{
            main?: string;
            description?: string;
          }>;
          main?: {
            temp?: number;
            feels_like?: number;
          };
        } = await response.json();
        const conditionText = (
          data.weather?.[0]?.description ??
          data.weather?.[0]?.main ??
          ''
        ).toLowerCase();
        const tempC = Number(data.main?.temp ?? 0);
        const feelsLike = Number(data.main?.feels_like ?? tempC);
        const isRaining = /(rain|drizzle|shower|storm|thunder)/.test(conditionText);
        const isVeryHot = feelsLike >= 33;
        if (isActive) {
          setWeatherState({ isRaining, isVeryHot, tempC, conditionText });
          setIsWeatherLoading(false);
        }
      } catch {
        if (isActive) {
          setWeatherState(null);
          setIsWeatherLoading(false);
        }
      }
    };

    void loadWeather();

    return () => {
      isActive = false;
    };
  }, [seniorCentersReloadTick]);

  React.useEffect(() => {
    let isActive = true;

    const toRadians = (value: number) => (value * Math.PI) / 180;
    const getDistanceKm = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
      const earthRadiusKm = 6371;
      const dLat = toRadians(toLat - fromLat);
      const dLng = toRadians(toLng - fromLng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(fromLat)) *
        Math.cos(toRadians(toLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return earthRadiusKm * c;
    };

    const loadNearbySeniorCenters = async () => {
      setIsSeniorCentersLoading(true);
      setSeniorCentersError(null);

      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        if (isActive) {
          setNearbySeniorCenters([]);
          setSeniorCentersError('Missing Google Maps API key');
          setIsSeniorCentersLoading(false);
        }
        return;
      }

      try {
        let latitude = 22.3193;
        let longitude = 114.1694;
        try {
          const permission = await Location.requestForegroundPermissionsAsync();
          if (permission.status === 'granted') {
            const position = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
          }
        } catch { }

        const categoryQueries: Record<
          'centres' | 'community' | 'residential',
          string[]
        > = {
          centres: [
            'senior center',
            'elderly centre',
            'elderly center',
            'senior activity center',
            '長者中心',
            '長者活動中心',
          ],
          community: [
            'community centre',
            'community center',
            'day care center',
            'elderly services',
            'community care center',
            '長者日間護理',
            '社區長者服務中心',
            '長者地區中心',
          ],
          residential: [
            'nursing home',
            'care home',
            'residential care home',
            'old age home',
            '安老院',
            '護老院',
            '老人院',
          ],
        };

        const combined = new Map<string, NearbySeniorCenter>();
        let apiError: string | null = null;

        const searchRadii = [10000, 30000, 80000];
        const countByCategory = (map: Map<string, NearbySeniorCenter>) => {
          let centres = 0;
          let community = 0;
          let residential = 0;
          for (const item of map.values()) {
            if (item.category === 'centres') centres += 1;
            if (item.category === 'community') community += 1;
            if (item.category === 'residential') residential += 1;
          }
          return { centres, community, residential };
        };
        const classifyCategory = (
          name: string,
          address: string,
          fallback: NearbySeniorCenter['category']
        ): NearbySeniorCenter['category'] => {
          const text = `${name} ${address}`.toLowerCase();
          if (
            /(nursing|residential|care home|old age home|安老院|護老院|老人院|院舍)/.test(text)
          ) {
            return 'residential';
          }
          if (
            /(community|day care|elderly services|社區|日間|地區中心|服務中心)/.test(text)
          ) {
            return 'community';
          }
          if (/(centre|center|長者中心|活動中心)/.test(text)) {
            return 'centres';
          }
          return fallback;
        };

        const searchPlaces = async (
          textQuery: string,
          category: NearbySeniorCenter['category'],
          radiusMeters?: number
        ) => {
          const body: {
            textQuery: string;
            languageCode: string;
            regionCode: string;
            maxResultCount: number;
            locationBias?: {
              circle: {
                center: { latitude: number; longitude: number };
                radius: number;
              };
            };
          } = {
            textQuery,
            languageCode: 'zh-Hant',
            regionCode: 'HK',
            maxResultCount: 20,
          };
          if (radiusMeters) {
            body.locationBias = {
              circle: {
                center: { latitude, longitude },
                radius: radiusMeters,
              },
            };
          }

          const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask':
                'places.id,places.displayName,places.formattedAddress,places.location,places.photos,places.currentOpeningHours.openNow',
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            const responseText = await response.text();
            apiError = responseText || `HTTP ${response.status}`;
            return;
          }

          const data = (await response.json()) as {
            places?: Array<{
              id?: string;
              displayName?: { text?: string };
              formattedAddress?: string;
              location?: { latitude?: number; longitude?: number };
              photos?: Array<{ name?: string }>;
              currentOpeningHours?: { openNow?: boolean };
            }>;
            error?: { message?: string };
          };

          if (data.error?.message) {
            apiError = data.error.message;
            return;
          }

          const mapped =
            data.places?.map((place) => {
              const placeLat = Number(place.location?.latitude ?? latitude);
              const placeLng = Number(place.location?.longitude ?? longitude);
              return {
                id: place.id ?? `${place.displayName?.text ?? 'center'}-${place.formattedAddress ?? 'unknown'}`,
                name: place.displayName?.text ?? 'Senior centre',
                address: place.formattedAddress ?? 'Address unavailable',
                distanceKm: getDistanceKm(latitude, longitude, placeLat, placeLng),
                mapQuery: `${place.displayName?.text ?? 'Senior centre'} ${place.formattedAddress ?? ''}`.trim(),
                photoUri: place.photos?.[0]?.name
                  ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=160&maxHeightPx=160&key=${apiKey}`
                  : undefined,
                category: classifyCategory(
                  place.displayName?.text ?? 'Senior centre',
                  place.formattedAddress ?? '',
                  category
                ),
                openNow:
                  typeof place.currentOpeningHours?.openNow === 'boolean'
                    ? place.currentOpeningHours.openNow
                    : undefined,
              };
            }) ?? [];

          for (const item of mapped) {
            if (!combined.has(item.id)) {
              combined.set(item.id, item);
            }
          }
        };

        const targetCount = seniorFetchDepth * SENIOR_PAGE_SIZE;
        const minPerTabOnFirstLoad = 5;
        const hasFirstLoadCoverage = () => {
          if (seniorFetchDepth > 1) {
            return true;
          }
          const counts = countByCategory(combined);
          return (
            counts.centres >= minPerTabOnFirstLoad &&
            counts.community >= minPerTabOnFirstLoad &&
            counts.residential >= minPerTabOnFirstLoad
          );
        };
        let reachedTarget = false;
        outer: for (const radius of searchRadii) {
          for (const category of Object.keys(categoryQueries) as Array<NearbySeniorCenter['category']>) {
            for (const keyword of categoryQueries[category]) {
              await searchPlaces(keyword, category, radius);
              if (combined.size >= targetCount && hasFirstLoadCoverage()) {
                reachedTarget = true;
                break outer;
              }
            }
          }
        }

        // Fallback to HK-wide text queries when local radius is still not enough.
        if (!reachedTarget) {
          const hkQueries: Array<{ query: string; category: NearbySeniorCenter['category'] }> = [
            { query: 'senior centre in Hong Kong', category: 'centres' },
            { query: 'elderly centre in Hong Kong', category: 'centres' },
            { query: 'community care center in Hong Kong', category: 'community' },
            { query: 'residential care home in Hong Kong', category: 'residential' },
            { query: 'senior day care in Hong Kong', category: 'community' },
            { query: 'nursing home in Hong Kong', category: 'residential' },
            { query: '長者中心 香港', category: 'centres' },
            { query: '社區長者服務中心 香港', category: 'community' },
            { query: '安老院 香港', category: 'residential' },
          ];
          for (const item of hkQueries) {
            await searchPlaces(item.query, item.category);
            if (combined.size >= targetCount && hasFirstLoadCoverage()) {
              reachedTarget = true;
              break;
            }
          }
        }

        const finalList = Array.from(combined.values())
          .sort((a, b) => a.distanceKm - b.distanceKm);

        if (isActive) {
          setNearbySeniorCenters(finalList);
          setHasMoreSeniorCenters(reachedTarget);
          setSeniorCentersError(
            finalList.length === 0
              ? apiError
                ? `Google Places error: ${apiError}`
                : 'No nearby senior centres found'
              : null
          );
          setIsSeniorCentersLoading(false);
        }
      } catch (error) {
        if (isActive) {
          setNearbySeniorCenters([]);
          setHasMoreSeniorCenters(false);
          const message =
            error instanceof Error && error.message
              ? error.message
              : 'Unable to load nearby senior centres';
          setSeniorCentersError(message);
          setIsSeniorCentersLoading(false);
        }
      }
    };

    void loadNearbySeniorCenters();

    return () => {
      isActive = false;
    };
  }, [seniorCentersReloadTick, seniorFetchDepth]);

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    const slot = getDaySlot(hour);
    const weatherPeriod = getWeatherPeriod(hour);
    const fallback = personalize(pickRandom(GREETINGS[slot]));

    if (weatherState?.isRaining) {
      const rainy = WEATHER_GREETINGS[weatherPeriod].rain;
      return rainy.length > 0 ? personalize(pickRandom(rainy)) : fallback;
    }
    if (weatherState?.isVeryHot) {
      const hot = WEATHER_GREETINGS[weatherPeriod].hot;
      return hot.length > 0 ? personalize(pickRandom(hot)) : fallback;
    }
    return fallback;
  }, [weatherState]);

  const [headline, subline] = React.useMemo(() => splitGreeting(greeting), [greeting]);
  const filteredSeniorCenters = React.useMemo(() => {
    const base =
      selectedSeniorTab === 'all'
        ? nearbySeniorCenters
        : nearbySeniorCenters.filter((item) => item.category === selectedSeniorTab);
    return openNowOnly ? base.filter((item) => item.openNow === true) : base;
  }, [nearbySeniorCenters, selectedSeniorTab, openNowOnly]);
  const visibleSeniorCenters = React.useMemo(
    () => filteredSeniorCenters.slice(0, visibleSeniorCount),
    [filteredSeniorCenters, visibleSeniorCount]
  );

  React.useEffect(() => {
    setVisibleSeniorCount(SENIOR_PAGE_SIZE);
    seniorListRef.current?.scrollTo({ y: 0, animated: false });
  }, [selectedSeniorTab, seniorCentersReloadTick]);

  return (
    <View className="flex-1 bg-background">
      <Image
        source={TOP_BG}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: undefined,
          height: undefined,
          aspectRatio: TOP_BG_ASPECT_RATIO,
        }}
      />
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="w-full pb-2">
          <View className="px-5 pt-20">
            <View className="flex-row items-center justify-between">
              <View className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                <Image source={avatarSource} style={{ width: 48, height: 48 }} resizeMode="contain" />
              </View>
              <Button size="icon" variant="ghost" onPress={() => router.push('/settings')}>
                <Icon as={SettingsIcon} className="size-5" />
              </Button>
            </View>

            <View className="mt-6 gap-2">
              <View className="flex-row items-center justify-between gap-3">
                <Text variant="large" className="flex-1 text-muted-foreground">
                  {headline}
                </Text>
                <GlassCard intensity={40} style={{ borderRadius: 99, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Icon
                    as={weatherState ? getWeatherIcon(weatherState.conditionText) : CloudIcon}
                    className="mr-1 size-3.5 text-muted-foreground"
                  />
                  <Text className="text-xs text-muted-foreground">
                    {weatherState ? `${Math.round(weatherState.tempC)}°C` : isWeatherLoading ? '...' : '--°C'}
                  </Text>
                </GlassCard>
              </View>
              {subline ? (
                <Text variant="h2" className="border-0 text-left text-foreground">
                  {subline}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View className="gap-2 px-5 pb-24">
          <View className="mb-2 flex-row items-center justify-between">
            <Text variant="large" className="font-tc-semibold text-foreground">
              Suggested Content
            </Text>
          </View>
          <View className="w-full pb-8">
            <VideoCard source={{ uri: SUGGESTED_CONTENT[0].videoUri }} poster={SUGGESTED_CONTENT[0].thumb} />
            <Text className="mt-2 text-sm text-foreground">{SUGGESTED_CONTENT[0].title}</Text>
            <View
              className={`mt-2 self-start rounded-full px-2 py-0.5 ${CATEGORY_BADGE_COLOR[SUGGESTED_CONTENT[0].category as keyof typeof CATEGORY_BADGE_COLOR]
                }`}>
              <Text className="text-[11px] font-tc-medium text-foreground">{SUGGESTED_CONTENT[0].category}</Text>
            </View>
          </View>

          <View className="mb-2 mt-2 h-9 flex-row items-center justify-between">
            <Text variant="large" className="font-tc-semibold text-foreground">
              {bookmarks.length > 0 ? `Bookmark (${bookmarks.length})` : 'Bookmark'}
            </Text>
            {bookmarks.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="web:hover:bg-muted/60"
                onPress={() => router.push('/bookmark')}>
                <Text className="text-arh-blue">View All</Text>
              </Button>
            ) : (
              <View className="h-8 w-16" />
            )}
          </View>
          {bookmarks.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-5"
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}>
              {bookmarks.map((film, index) => (
                (() => {
                  const tagTone = getBookmarkTagTone(film.sourcePage);
                  return (
                    <View key={film.id} className={`w-64 ${index === bookmarks.length - 1 ? '' : 'mr-4'}`}>
                      <VideoCard source={{ uri: film.videoUri }} poster={film.thumb} />
                      <View className="mt-2 flex-row items-center gap-2">
                        <Text className="flex-1 text-sm text-foreground">{film.title}</Text>
                        <Pressable
                          onPress={() => handleRemoveBookmark(film)}
                          className="h-8 w-8 items-center justify-center rounded-full bg-muted/60">
                          <Icon as={BookmarkIcon} className="size-4 text-arh-amber" fill="#DEA202" />
                        </Pressable>
                      </View>
                      <View
                        className={`mt-1 max-w-full self-start rounded-full px-2 py-0.5 ${
                          tagTone === 'documentary'
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
                          {[film.sourcePage, film.sourceSection].filter(Boolean).join(' · ') || 'Unknown'}
                        </Text>
                      </View>
                    </View>
                  );
                })()
              ))}
            </ScrollView>
          ) : (
            <View className="mb-3 rounded-2xl border border-dashed border-border bg-card px-4 py-6">
              <Text className="text-sm text-muted-foreground">
                Bookmark videos and they will appear here.
              </Text>
            </View>
          )}

          <View className="mb-2 mt-2 flex-row items-center justify-between">
            <Text variant="large" className="font-tc-semibold text-foreground">
              Nearby Senior Centres
            </Text>
            <View className="flex-row items-center gap-2">
              <Pressable onPress={() => setOpenNowOnly((value) => !value)}>
                <Text className="text-xs text-muted-foreground">Open Only</Text>
              </Pressable>
              <Switch size="sm" checked={openNowOnly} onCheckedChange={setOpenNowOnly} />
            </View>
          </View>
          <View className="mb-2">
            <View className="flex-row rounded-lg bg-muted p-1">
              {SENIOR_CENTER_TABS.map((tab) => {
                const isActive = selectedSeniorTab === tab.key;
                const isAllTab = tab.key === 'all';
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => {
                      if (Platform.OS !== 'web') {
                        void Haptics.selectionAsync();
                      }
                      setSelectedSeniorTab(tab.key);
                    }}
                    className={`items-center justify-center rounded-md px-3 py-1.5 ${isAllTab ? '' : 'flex-1'
                      } ${isActive ? 'bg-background' : ''}`}>
                    <Text className={`text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <GlassCard intensity={50} style={{ marginBottom: 32, height: 400, overflow: 'hidden' }}>
            {isSeniorCentersLoading ? (
              <View className="gap-3 px-3 pt-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <View key={`senior-skeleton-${index}`} className="flex-row items-start gap-3">
                    <Skeleton className="h-14 w-14 rounded-lg" />
                    <View className="flex-1 gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </View>
                    <Skeleton className="h-3 w-10 rounded-full" />
                  </View>
                ))}
              </View>
            ) : null}
            {!isSeniorCentersLoading && visibleSeniorCenters.length > 0 ? (
              <ScrollView
                ref={seniorListRef}
                className="h-full"
                showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                  const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
                  const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 24;
                  if (isNearBottom && visibleSeniorCount < filteredSeniorCenters.length) {
                    setVisibleSeniorCount((value) =>
                      Math.min(value + SENIOR_PAGE_SIZE, filteredSeniorCenters.length)
                    );
                  } else if (
                    isNearBottom &&
                    visibleSeniorCount >= filteredSeniorCenters.length &&
                    hasMoreSeniorCenters &&
                    !isSeniorCentersLoading
                  ) {
                    setSeniorFetchDepth((value) => value + 1);
                  }
                }}
                scrollEventThrottle={16}>
                {visibleSeniorCenters.map((center, index) => (
                  <View key={center.id}>
                    <Pressable
                      className="px-3 py-3"
                      onPress={async () => {
                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.mapQuery)}`;
                        try {
                          await Linking.openURL(url);
                        } catch {
                          // noop
                        }
                      }}>
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="h-14 w-14 overflow-hidden rounded-lg bg-muted">
                          {center.photoUri ? (
                            <Image source={{ uri: center.photoUri }} className="h-full w-full" resizeMode="cover" />
                          ) : (
                            <View className="h-full w-full items-center justify-center">
                              <Icon as={ImageIcon} className="size-4 text-muted-foreground" />
                            </View>
                          )}
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-start justify-between gap-2">
                            <Text className="flex-1 text-base font-tc-semibold text-foreground">{center.name}</Text>
                            {center.openNow !== undefined ? (
                              <Text
                                className={`text-xs font-tc-medium ${center.openNow ? 'text-arh-green' : 'text-arh-red'
                                  }`}>
                                {center.openNow ? 'Open' : 'Closed'}
                              </Text>
                            ) : null}
                          </View>
                          <Text className="mt-0.5 text-xs text-muted-foreground">
                            {center.distanceKm < 1
                              ? `${Math.round(center.distanceKm * 1000)} m away`
                              : `${center.distanceKm.toFixed(1)} km away`}
                          </Text>
                        </View>
                        <Icon as={ChevronRightIcon} className="mt-0.5 size-4 text-muted-foreground" />
                      </View>
                    </Pressable>
                    {index < visibleSeniorCenters.length - 1 ? (
                      <View className="mx-3 my-1 h-[1px] bg-border" />
                    ) : null}
                  </View>
                ))}
              </ScrollView>
            ) : null}
            {!isSeniorCentersLoading && filteredSeniorCenters.length === 0 ? (
              <Text className="px-3 pt-3 text-sm text-muted-foreground">
                {openNowOnly
                  ? 'No open centres nearby right now.'
                  : seniorCentersError ?? 'No nearby senior centres found.'}
              </Text>
            ) : null}
          </GlassCard>

          {artsActivityCardState === 'form' ? (
            <>
              <View className="flex-row items-center justify-between">
                <Text variant="large" className="font-tc-semibold text-foreground">
                  Arts activity check
                </Text>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onPress={() => setArtsActivityCardState('hidden')}>
                  <Icon as={XIcon} className="size-4 text-muted-foreground" />
                </Button>
              </View>

              <GlassCard intensity={50} style={{ marginTop: 8, padding: 16 }}>
                <Text className="p text-muted-foreground">
                  Have you taken part in any arts activity this week?
                </Text>

                <View className="mt-4 flex-row gap-2">
                  <Button
                    className="flex-1"
                    size="lg"
                    variant={artsActivityAnswer === 'yes' ? 'default' : 'outline'}
                    onPress={() => {
                      setArtsActivityAnswer('yes');
                    }}>
                    <Text>Yes</Text>
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    variant={artsActivityAnswer === 'no' ? 'default' : 'outline'}
                    onPress={() => {
                      setArtsActivityAnswer('no');
                      setArtsActivityOption(null);
                      setArtsActivityCardState('answered');
                    }}>
                    <Text>No</Text>
                  </Button>
                </View>

                {artsActivityAnswer === 'yes' ? (
                  <View className="mt-4">
                    <Text className="text-xs text-muted-foreground">
                      Optional quick choice
                    </Text>
                    <View className="mt-2 flex-row flex-wrap gap-2">
                      {ARTS_ACTIVITY_OPTIONS.map((option) => (
                        <Button
                          key={option}
                          size="sm"
                          variant={artsActivityOption === option ? 'default' : 'outline'}
                          onPress={() => {
                            setArtsActivityOption(option);
                            setArtsActivityCardState('answered');
                          }}>
                          <Text>{option}</Text>
                        </Button>
                      ))}
                    </View>
                  </View>
                ) : null}
              </GlassCard>
            </>
          ) : null}

          {artsActivityCardState === 'answered' ? (
            <GlassCard intensity={50} style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text className="text-sm font-tc-medium text-foreground">Thank you for answering</Text>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onPress={() => setArtsActivityCardState('hidden')}>
                <Icon as={XIcon} className="size-4 text-muted-foreground" />
              </Button>
            </GlassCard>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function getDaySlot(hour: number): DaySlot {
  if (hour >= 6 && hour <= 8) {
    return 'morningEarly';
  }
  if (hour >= 9 && hour <= 11) {
    return 'morningLate';
  }
  if (hour >= 12 && hour <= 14) {
    return 'afternoonEarly';
  }
  if (hour >= 15 && hour <= 17) {
    return 'afternoonLate';
  }
  if (hour >= 18 && hour <= 19) {
    return 'eveningEarly';
  }
  if (hour >= 20 && hour <= 21) {
    return 'eveningLate';
  }
  return 'night';
}

function getWeatherPeriod(hour: number): WeatherPeriod {
  if (hour >= 6 && hour <= 11) {
    return 'morning';
  }
  if (hour >= 12 && hour <= 17) {
    return 'afternoon';
  }
  if (hour >= 18 && hour <= 21) {
    return 'evening';
  }
  return 'night';
}

function getWeatherIcon(conditionText: string) {
  const value = conditionText.toLowerCase();
  if (/(rain|drizzle|shower|storm|thunder)/.test(value)) {
    return CloudRainIcon;
  }
  if (/(sun|clear)/.test(value)) {
    return SunIcon;
  }
  return CloudIcon;
}

function pickRandom(values: string[]): string {
  return values[Math.floor(Math.random() * values.length)];
}

function personalize(value: string): string {
  return value.replace('<user>', USER_NAME);
}

function splitGreeting(message: string): [string, string] {
  const parts = message.split('. ');
  if (parts.length <= 1) {
    return [message, ''];
  }
  const first = `${parts[0]}.`;
  const second = parts.slice(1).join('. ');
  return [first, second];
}
