import { useAppState } from 'hooks/app/useAppState';
import { useEffect } from 'react';

export function useSchoolDefinedStyling() {
  const appState = useAppState();

  useEffect(() => {
    const head = document.head;
    const styleUrl = `${import.meta.env.VITE_PUBLIC_URL
      }/styles/styles-student-parent.css?build=${appState.runtime.getBuildNo()}`; // The build parameter ensures updated styles between deploys.
    const defaultLink = loadStyle(styleUrl);

    return () => {
      unloadStyle(defaultLink);
    };

    function loadStyle(path: string) {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = path;
      head.appendChild(link);

      // Get primary and secondary colors
      const primaryColor = appState.school.primaryColor || 'transparent';
      const secondaryColor = appState.school.secondaryColor || 'transparent';

      // Set the primary and secondary colors
      document.body.style.setProperty('--catalogue-primary-color', primaryColor);
      document.body.style.setProperty('--catalogue-secondary-color', secondaryColor);


      // Calculate luminance of the primary color
      const primaryLuminance = calculateLuminance(primaryColor);

      // Calculate and set button text color based on luminance
      const buttonTextColor = primaryLuminance < 0.6 ? 'white' : 'black';
      document.body.style.setProperty('--catalogue-button-text-color', buttonTextColor);

      // Generate a background color with constant luminance
      const lightBackgroundColor = generateColorWithLuminance(primaryColor, 1);
      document.body.style.setProperty('--catalogue-light-background-color', lightBackgroundColor);

      return link;
    }

    function unloadStyle(link: HTMLLinkElement) {
      head.removeChild(link);
    }

    // Function to calculate luminance of a color
    function calculateLuminance(color: string): number {
      const rgbMatch = color.match(/(\d+),\s*(\d+),\s*(\d+)/);

      if (!rgbMatch) {
        console.warn('Invalid color format:', color);
        return 1; // Default to max luminance for invalid colors
      }

      const [r, g, b] = rgbMatch.slice(1, 4).map(Number); // Extract RGB values
      return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
    }

    // Function to generate a color with a constant luminance
    function generateColorWithLuminance(color: string, targetLuminance: number): string {
      const rgbMatch = color.match(/(\d+),\s*(\d+),\s*(\d+)/);

      if (!rgbMatch) {
        console.warn('Invalid color format, defaulting to light gray:', color);
        return '#EBEBEB'; // Default to light gray if the color format is invalid
      }

      const [r, g, b] = rgbMatch.slice(1, 4).map(Number); // Extract RGB values
      const currentLuminance = calculateLuminance(color);

      // Scale RGB values to match the target luminance
      const scaleFactor = targetLuminance / currentLuminance;
      const adjust = (value: number) => Math.min(255, Math.round(value * scaleFactor));

      const adjustedR = adjust(r);
      const adjustedG = adjust(g);
      const adjustedB = adjust(b);

      return `rgb(${adjustedR},${adjustedG},${adjustedB})`;
    }
  }, [appState.runtime, appState.school.primaryColor, appState.school.secondaryColor]);
}
