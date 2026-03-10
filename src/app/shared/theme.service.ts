import { Injectable, signal } from '@angular/core';

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  primary: string;
  secondary: string;
  accent: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceLight: string;
  text: string;
  textSecondary: string;
  border: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'samiti-selected-theme';
  
  public readonly themes: Theme[] = [
    {
      id: 'default-blue',
      name: 'default-blue',
      displayName: 'Blue',
      icon: '🔵',
      primary: '#1976d2',
      secondary: '#2196f3',
      accent: '#42a5f5',
      primaryLight: '#64b5f6',
      primaryDark: '#1565c0',
      background: '#f5f7fa',
      surface: '#ffffff',
      surfaceLight: '#f8f9fa',
      text: '#000000',
      textSecondary: '#000000',
      border: '#e0e0e0'
    },
    {
      id: 'islamic-green',
      name: 'islamic-green',
      displayName: 'Green',
      icon: '🕌',
      primary: '#2e7d32',
      secondary: '#4caf50',
      accent: '#66bb6a',
      primaryLight: '#81c784',
      primaryDark: '#1b5e20',
      background: '#f5f7fa',
      surface: '#ffffff',
      surfaceLight: '#f8f9fa',
      text: '#000000',
      textSecondary: '#000000',
      border: '#e0e0e0'
    },
    {
      id: 'hindu-orange',
      name: 'hindu-orange',
      displayName: 'Orange',
      icon: '🕉️',
      primary: '#ef6c00',
      secondary: '#ff9800',
      accent: '#ffb74d',
      primaryLight: '#ffb74d',
      primaryDark: '#c45400',
      background: '#f5f7fa',
      surface: '#ffffff',
      surfaceLight: '#f8f9fa',
      text: '#000000',
      textSecondary: '#000000',
      border: '#e0e0e0'
    },
    {
      id: 'royal-purple',
      name: 'royal-purple',
      displayName: 'Purple',
      icon: '👑',
      primary: '#7b1fa2',
      secondary: '#9c27b0',
      accent: '#ba68c8',
      primaryLight: '#ce93d8',
      primaryDark: '#4a148c',
      background: '#f5f7fa',
      surface: '#ffffff',
      surfaceLight: '#f8f9fa',
      text: '#000000',
      textSecondary: '#000000',
      border: '#e0e0e0'
    },
    {
      id: 'sunset-pink',
      name: 'sunset-pink',
      displayName: 'Pink',
      icon: '🌸',
      primary: '#c2185b',
      secondary: '#e91e63',
      accent: '#f06292',
      primaryLight: '#f48fb1',
      primaryDark: '#880e4f',
      background: '#f5f7fa',
      surface: '#ffffff',
      surfaceLight: '#f8f9fa',
      text: '#000000',
      textSecondary: '#000000',
      border: '#e0e0e0'
    },
    {
      id: 'dark-mode',
      name: 'dark-mode',
      displayName: 'Dark',
      icon: '🌙',
      primary: '#616161',
      secondary: '#757575',
      accent: '#9e9e9e',
      primaryLight: '#bdbdbd',
      primaryDark: '#424242',
      background: '#121212',
      surface: '#1e1e1e',
      surfaceLight: '#2c2c2c',
      text: '#e0e0e0',
      textSecondary: '#b0b0b0',
      border: '#424242'
    }
  ];

  public currentTheme = signal<Theme>(this.themes[0]);

  constructor() {
    this.loadSavedTheme();
    this.applyTheme(this.currentTheme());
  }

  private loadSavedTheme(): void {
    try {
      const savedThemeId = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (savedThemeId) {
        const theme = this.themes.find(t => t.id === savedThemeId);
        if (theme) {
          this.currentTheme.set(theme);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
    }
  }

  public setTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
      this.applyTheme(theme);
      try {
        localStorage.setItem(this.THEME_STORAGE_KEY, theme.id);
      } catch (error) {
        console.warn('Failed to save theme:', error);
      }
    }
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string): string => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
    };
    
    // Apply all theme colors as CSS variables
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-primary-rgb', hexToRgb(theme.primary));
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-primary-light', theme.primaryLight);
    root.style.setProperty('--theme-primary-dark', theme.primaryDark);
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--theme-surface', theme.surface);
    root.style.setProperty('--theme-surface-light', theme.surfaceLight);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-secondary', theme.textSecondary);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-gradient', `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`);
    
    // Add additional background variables
    root.style.setProperty('--theme-bg-light', theme.surfaceLight);
    root.style.setProperty('--theme-bg-white', theme.surface);
    
    // Set color-scheme based on theme
    const isDark = theme.id === 'dark-mode';
    document.body.style.colorScheme = isDark ? 'dark' : 'light';
    
    // Override Material Design system variables for dark mode
    if (isDark) {
      root.style.setProperty('--mat-sys-surface', theme.surface);
      root.style.setProperty('--mat-sys-on-surface', theme.text);
      root.style.setProperty('--mat-sys-background', theme.background);
      root.style.setProperty('--mat-sys-on-background', theme.text);
    } else {
      // Reset to default Material values for light themes
      root.style.removeProperty('--mat-sys-surface');
      root.style.removeProperty('--mat-sys-on-surface');
      root.style.removeProperty('--mat-sys-background');
      root.style.removeProperty('--mat-sys-on-background');
    }
    
    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.id}`);
  }
}
