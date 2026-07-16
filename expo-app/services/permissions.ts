import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

import { useAppStore } from '@/store/app-store';

type NotificationsModule = typeof import('expo-notifications');

function shouldSkipNotificationsInExpoGo() {
  return Platform.OS === 'android' && Constants.appOwnership === 'expo';
}

async function getNotifications(): Promise<NotificationsModule | null> {
  if (shouldSkipNotificationsInExpoGo()) {
    return null;
  }

  return import('expo-notifications');
}

export async function syncPermissionState() {
  const notificationsApi = await getNotifications();
  const [location, notifications] = await Promise.all([
    Location.getForegroundPermissionsAsync(),
    notificationsApi?.getPermissionsAsync(),
  ]);

  const permissions = {
    locationGranted: location.status === Location.PermissionStatus.GRANTED,
    notificationsGranted:
      !notificationsApi || notifications?.granted || notifications?.status === 'granted',
  };

  useAppStore.getState().setPermissions(permissions);
  return permissions;
}

export async function requestRequiredPermissions() {
  const notificationsApi = await getNotifications();

  if (Platform.OS === 'android' && notificationsApi) {
    await notificationsApi.setNotificationChannelAsync('hora-alerts', {
      name: 'Hora alerts',
      importance: notificationsApi.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 150, 250],
      lightColor: '#D84B35',
    });
  }

  const [location, notifications] = await Promise.all([
    Location.requestForegroundPermissionsAsync(),
    notificationsApi?.requestPermissionsAsync(),
  ]);

  const permissions = {
    locationGranted: location.status === Location.PermissionStatus.GRANTED,
    notificationsGranted:
      !notificationsApi || notifications?.granted || notifications?.status === 'granted',
  };

  useAppStore.getState().setPermissions(permissions);
  return permissions;
}

export async function getCurrentCoordinates() {
  const lastKnown = await Location.getLastKnownPositionAsync({
    maxAge: 1000 * 60 * 30,
    requiredAccuracy: 5000,
  });

  const location =
    lastKnown ??
    (await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    }));

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}
