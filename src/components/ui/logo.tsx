import { Image } from '@/components/ui/image';
import cn from 'classnames';
import Link from '@/components/ui/link';
import { logoPlaceholder } from '@/lib/placeholders';
import { useSettings } from '@/framework/settings';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const {
    settings: { logo, siteTitle },
  }: any = useSettings();
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center no-underline outline-none focus:outline-none', className)}
      {...props}
    >
      <div className="text-3xl font-bold tracking-tight">
        <span className="text-[#0d1136]">Zone</span>
        <span className="text-[#008d71]">4Build</span>
      </div>
    </Link>
  );
};

export default Logo;
