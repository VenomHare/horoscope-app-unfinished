import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { getGrahaName, grahaSymbols } from '@/lib/graha';
import type { HoraDay, HoraPeriod } from '@/lib/hora-detector';
import { t, type AppLanguage } from '@/locales/translations';
import { useAppStore } from '@/store/app-store';

type NotificationsModule = typeof import('expo-notifications');

function shouldSkipNotificationsInExpoGo() {
  return Platform.OS === 'android' && Constants.appOwnership === 'expo';
}

async function getNotifications(): Promise<NotificationsModule | null> {
  if (shouldSkipNotificationsInExpoGo()) {
    return null;
  }

  const notifications = await import('expo-notifications');

  notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return notifications;
}

const STICKY_NOTIFICATION_ID = 'current-hora-status';

function makeCurrentHoraBody(period: HoraPeriod, language: AppLanguage) {
  return `${t(language, 'starts')} ${formatTime(period.start)} - ${t(language, 'ends')} ${formatTime(
    period.end,
  )}`;
}

function makeAlertBody(
  period: HoraPeriod,
  offsetMinutes: number,
  kind: 'start' | 'end',
  language: AppLanguage,
) {
  const actionKey = kind === 'start' ? 'horaStartingIn' : 'horaEndingIn';
  const minuteKey = offsetMinutes === 1 ? 'minuteSingular' : 'minutePlural';

  return `${getGrahaName(period.graha, language)} ${t(language, actionKey)} ${offsetMinutes} ${t(
    language,
    minuteKey,
  )}`;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

async function scheduleForPeriods(
  notifications: NotificationsModule,
  periods: HoraPeriod[],
  language: AppLanguage,
) {
  const state = useAppStore.getState();
  const now = Date.now();
  const scheduled: Promise<string>[] = [];

  periods.forEach((period) => {
    const startPreference = state.startAlerts[period.graha];
    const endPreference = state.endAlerts[period.graha];

    if (startPreference?.enabled) {
      const triggerAt = period.start.getTime() - startPreference.offsetMinutes * 60 * 1000;

      if (triggerAt > now) {
        scheduled.push(
          notifications.scheduleNotificationAsync({
            content: {
              title: `${grahaSymbols[period.graha]} ${getGrahaName(period.graha, language)}`,
              body: makeAlertBody(period, startPreference.offsetMinutes, 'start', language),
              data: { screen: 'home', graha: period.graha, kind: 'start' },
            },
            trigger: {
              type: notifications.SchedulableTriggerInputTypes.DATE,
              date: new Date(triggerAt),
            },
          }),
        );
      }
    }

    if (endPreference?.enabled) {
      const triggerAt = period.end.getTime() - endPreference.offsetMinutes * 60 * 1000;

      if (triggerAt > now) {
        scheduled.push(
          notifications.scheduleNotificationAsync({
            content: {
              title: `${getGrahaName(period.graha, language)} ${t(language, 'ends')}`,
              body: makeAlertBody(period, endPreference.offsetMinutes, 'end', language),
              data: { screen: 'home', graha: period.graha, kind: 'end' },
            },
            trigger: {
              type: notifications.SchedulableTriggerInputTypes.DATE,
              date: new Date(triggerAt),
            },
          }),
        );
      }
    }
  });

  await Promise.all(scheduled);
}

export async function refreshHoraNotifications(day: HoraDay, language: AppLanguage) {
  const notifications = await getNotifications();

  if (!notifications) {
    return;
  }

  await notifications.cancelAllScheduledNotificationsAsync();
  await scheduleForPeriods(notifications, day.periods, language);

  if (Platform.OS === 'android' && useAppStore.getState().stickyNotificationsEnabled) {
    await scheduleStickyNotification(notifications, day, language);
  }
}

async function scheduleStickyNotification(
  notifications: NotificationsModule,
  day: HoraDay,
  language: AppLanguage,
) {
  await notifications.scheduleNotificationAsync({
    identifier: STICKY_NOTIFICATION_ID,
    content: {
      title: `${grahaSymbols[day.current.graha]} ${getGrahaName(day.current.graha, language)}`,
      body: makeCurrentHoraBody(day.current, language),
      sticky: true,
      autoDismiss: false,
      data: { screen: 'home', kind: 'sticky', graha: day.current.graha },
    },
    trigger: null,
  });
}

export async function ensureStickyHoraNotification(day: HoraDay, language: AppLanguage) {
  if (Platform.OS !== 'android' || !useAppStore.getState().stickyNotificationsEnabled) {
    return;
  }

  const notifications = await getNotifications();

  if (!notifications) {
    return;
  }

  const presented = await notifications.getPresentedNotificationsAsync();
  const hasStickyNotification = presented.some(
    (notification) => notification.request.identifier === STICKY_NOTIFICATION_ID,
  );

  if (!hasStickyNotification) {
    await scheduleStickyNotification(notifications, day, language);
  }
}
