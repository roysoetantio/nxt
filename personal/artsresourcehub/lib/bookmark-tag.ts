export function getBookmarkTagTone(sourcePage?: string) {
  const page = (sourcePage ?? '').toLowerCase();

  if (page.includes('documentary')) {
    return 'documentary' as const;
  }

  if (page.includes('learning')) {
    return 'learning' as const;
  }

  if (page.includes('guide')) {
    return 'guides' as const;
  }

  if (page.includes('evaluation')) {
    return 'evaluation' as const;
  }

  return 'default' as const;
}
