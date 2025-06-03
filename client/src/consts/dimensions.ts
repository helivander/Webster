export const standardDimensions = [
  { label: 'Instagram Post (1:1)', width: 1080, height: 1080 },
  { label: 'Instagram Story (9:16)', width: 1080, height: 1920 },
  { label: 'Facebook Post (1.91:1)', width: 1200, height: 630 },
  { label: 'Facebook Cover (2.7:1)', width: 851, height: 315 },
  { label: 'Twitter Post (16:9)', width: 1200, height: 675 },
  { label: 'Twitter Header (3:1)', width: 1500, height: 500 },
  { label: 'LinkedIn Post (1:1)', width: 1200, height: 1200 },
  { label: 'LinkedIn Cover (4:1)', width: 1584, height: 396 },
  { label: 'YouTube Thumbnail (16:9)', width: 1280, height: 720 },
  { label: 'YouTube Cover (16:9)', width: 2560, height: 1440 },
] as const;

export type StandardDimension = typeof standardDimensions[number]; 