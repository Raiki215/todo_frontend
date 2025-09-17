// Minimal type declarations for Vanta.js fog effect
// This resolves TS7016: Could not find a declaration file for module 'vanta/dist/vanta.fog.min'

declare module "vanta/dist/vanta.fog.min" {
  type VantaInstance = {
    destroy: () => void;
  };

  type VantaOptions = {
    el: HTMLElement | null;
    THREE?: any;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    highlightColor?: number;
    midtoneColor?: number;
    lowlightColor?: number;
    baseColor?: number;
    blurFactor?: number;
    speed?: number;
    zoom?: number;
    [key: string]: any;
  };

  const VantaFog: (options: VantaOptions) => VantaInstance;
  export default VantaFog;
}
