declare module 'lucide-react' {
  import * as React from 'react';
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number;
  }
  export const Video: React.ComponentType<LucideProps>;
  export const MicOff: React.ComponentType<LucideProps>;
  export const Mic: React.ComponentType<LucideProps>;
  export const Grid: React.ComponentType<LucideProps>;
  export const ChevronDown: React.ComponentType<LucideProps>;
  export const ChevronUp: React.ComponentType<LucideProps>;
  export const Search: React.ComponentType<LucideProps>;
  export default {};
}
