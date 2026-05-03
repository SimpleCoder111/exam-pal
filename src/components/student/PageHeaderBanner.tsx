import { ReactNode } from 'react';

interface PageHeaderBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const PageHeaderBanner = ({ image, title, subtitle, actions }: PageHeaderBannerProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-elevated bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border mb-6">
      <div className="flex items-center justify-between gap-4 p-6 md:p-8">
        <div className="flex-1 min-w-0 z-10">
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl">
              {subtitle}
            </p>
          )}
          {actions && <div className="mt-4">{actions}</div>}
        </div>
        <div className="hidden md:block flex-shrink-0 w-[280px] lg:w-[380px] xl:w-[440px]">
          <img
            src={image}
            alt=""
            loading="lazy"
            className="w-full h-auto object-contain max-h-40 lg:max-h-48"
          />
        </div>
      </div>
    </div>
  );
};

export default PageHeaderBanner;
