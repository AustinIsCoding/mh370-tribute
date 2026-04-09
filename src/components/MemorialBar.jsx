import { useLang } from '../hooks/useLang';
import { i18n, t } from '../data/i18n';

export default function MemorialBar() {
  const { lang } = useLang();
  return (
    <div className="memorial-bar">
      <span>{t(i18n.memorialBar, lang)}</span>
    </div>
  );
}
