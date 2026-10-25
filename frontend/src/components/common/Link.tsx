import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, href, children, ...props }, ref) => {
  const destination = to || href || '/';
  return (
    <RouterLink ref={ref} to={destination} {...(props as any)}>
      {children}
    </RouterLink>
  );
});

Link.displayName = 'Link';
export default Link;
