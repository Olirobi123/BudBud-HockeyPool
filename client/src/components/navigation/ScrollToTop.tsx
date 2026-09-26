import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * React Router garde la position de défilement d'une page à l'autre : chaque
 * clic sur un lien arrivait au milieu de la nouvelle page. On remonte en haut
 * à chaque changement de page, sauf pour Précédent / Suivant (POP), où le
 * navigateur restaure lui-même la position.
 */
// eslint-disable-next-line import/prefer-default-export
export function ScrollToTop(): null {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
}
