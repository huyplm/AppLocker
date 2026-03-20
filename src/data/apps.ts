import { AppInfo } from '../types';

export const installedApps: AppInfo[] = [
  { id: 'chrome', name: 'Chrome', category: 'Productivity', icon: '🌐', color: '#4285F4' },
  { id: 'discord', name: 'Discord', category: 'Social', icon: '💬', color: '#5865F2' },
  { id: 'facebook', name: 'Facebook', category: 'Social', icon: '📘', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', category: 'Social', icon: '📷', color: '#E4405F' },
  { id: 'messenger', name: 'Messenger', category: 'Social', icon: '💭', color: '#0084FF' },
  { id: 'netflix', name: 'Netflix', category: 'Entertainment', icon: '🎬', color: '#E50914' },
  { id: 'outlook', name: 'Outlook', category: 'Productivity', icon: '📧', color: '#0078D4' },
  { id: 'reddit', name: 'Reddit', category: 'Social', icon: '🔴', color: '#FF4500' },
  { id: 'roblox', name: 'Roblox', category: 'Games', icon: '🎮', color: '#E2231A' },
  { id: 'snapchat', name: 'Snapchat', category: 'Social', icon: '👻', color: '#FFFC00' },
  { id: 'spotify', name: 'Spotify', category: 'Music', icon: '🎵', color: '#1DB954' },
  { id: 'tiktok', name: 'TikTok', category: 'Social', icon: '🎶', color: '#010101' },
  { id: 'twitter', name: 'Twitter', category: 'Social', icon: '🐦', color: '#1DA1F2' },
  { id: 'youtube', name: 'YouTube', category: 'Entertainment', icon: '▶️', color: '#FF0000' },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Social', icon: '💚', color: '#25D366' },
];

export const defaultSelectedAppIds = [
  'instagram',
  'twitter',
  'tiktok',
  'youtube',
  'reddit',
];
