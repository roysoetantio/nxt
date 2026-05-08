import * as React from 'react';

export type BookmarkedVideo = {
  id: string;
  title: string;
  videoUri: string;
  thumb: any;
  sourcePage?: string;
  sourceSection?: string;
};

type BookmarksContextValue = {
  bookmarks: BookmarkedVideo[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (video: BookmarkedVideo) => void;
};

const BookmarksContext = React.createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = React.useState<BookmarkedVideo[]>([]);

  const isBookmarked = React.useCallback(
    (id: string) => bookmarks.some((item) => item.id === id),
    [bookmarks]
  );

  const toggleBookmark = React.useCallback((video: BookmarkedVideo) => {
    setBookmarks((current) => {
      const exists = current.some((item) => item.id === video.id);
      if (exists) {
        return current.filter((item) => item.id !== video.id);
      }
      return [...current, video];
    });
  }, []);

  const value = React.useMemo(
    () => ({ bookmarks, isBookmarked, toggleBookmark }),
    [bookmarks, isBookmarked, toggleBookmark]
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks() {
  const context = React.useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within BookmarksProvider');
  }
  return context;
}
