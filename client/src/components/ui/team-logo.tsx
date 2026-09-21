import type { ImgHTMLAttributes } from 'react';
import { useSamsungForcedDark } from '@/hooks/useSamsungForcedDark';
import { toDarkTeamLogo } from '@/lib/teamLogo';

type Props = ImgHTMLAttributes<HTMLImageElement>;

/** NHL team logo that switches to the `_dark` variant under Samsung Internet's dark mode. */
export function TeamLogo({ src, alt = '', ...props }: Props) {
  const forcedDark = useSamsungForcedDark();
  return <img src={forcedDark && src ? toDarkTeamLogo(src) : src} alt={alt} {...props} />;
}
