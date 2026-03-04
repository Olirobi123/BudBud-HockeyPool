export type TeamImageFormat = 'png' | 'jpg';

export interface TeamImage {
  src: string;
  format: TeamImageFormat;
}

/**
 * Maps team ID to its image asset.
 * - format 'png': transparent background → white bg applied in TeamAvatar
 * - format 'jpg': opaque background → image fills avatar directly
 *
 * Images are stored in /client/public/images/teams/
 * Add the image file and set the correct format below.
 */
export const teamImages: Record<number, TeamImage> = {
  1:  { src: '/images/teams/1.png',  format: 'png' },
  2:  { src: '/images/teams/2.png',  format: 'png' },
  3:  { src: '/images/teams/3.jpg',  format: 'jpg' },
  4:  { src: '/images/teams/4.png',  format: 'png' },
  5:  { src: '/images/teams/5.png',  format: 'png' },
  6:  { src: '/images/teams/6.png',  format: 'png' },
  7:  { src: '/images/teams/7.png',  format: 'png' },
  8:  { src: '/images/teams/8.png',  format: 'png' },
  9:  { src: '/images/teams/9.jpg',  format: 'jpg' },
  10: { src: '/images/teams/10.png', format: 'png' },
  11: { src: '/images/teams/11.png', format: 'png' },
  12: { src: '/images/teams/12.png', format: 'png' },
  13: { src: '/images/teams/13.png', format: 'png' },
  14: { src: '/images/teams/14.jpg', format: 'png' },
};

export function getTeamImage(teamId: number): TeamImage | null {
  return teamImages[teamId] ?? null;
}
