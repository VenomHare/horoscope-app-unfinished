const {
  AndroidConfig,
  withAndroidManifest,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const WIDGET_RECEIVER = '.HoraWidgetReceiver';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeIfMissing(filePath, contents) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, contents);
  }
}

function withAndroidHoraWidget(config) {
  config = withAndroidManifest(config, (modConfig) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      modConfig.modResults,
    );
    const receiver = {
      $: {
        'android:name': WIDGET_RECEIVER,
        'android:exported': 'true',
        'android:label': 'Hora Detector',
      },
      'intent-filter': [
        {
          action: [
            {
              $: {
                'android:name': 'android.appwidget.action.APPWIDGET_UPDATE',
              },
            },
          ],
        },
      ],
      'meta-data': [
        {
          $: {
            'android:name': 'android.appwidget.provider',
            'android:resource': '@xml/hora_widget_info',
          },
        },
      ],
    };

    mainApplication.receiver = mainApplication.receiver ?? [];

    const hasReceiver = mainApplication.receiver.some(
      (item) => item.$?.['android:name'] === WIDGET_RECEIVER,
    );

    if (!hasReceiver) {
      mainApplication.receiver.push(receiver);
    }

    return modConfig;
  });

  return withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const projectRoot = modConfig.modRequest.platformProjectRoot;
      const resDir = path.join(projectRoot, 'app', 'src', 'main', 'res');
      const xmlDir = path.join(resDir, 'xml');
      const layoutDir = path.join(resDir, 'layout');
      const valuesDir = path.join(resDir, 'values');
      const drawableDir = path.join(resDir, 'drawable');

      ensureDir(xmlDir);
      ensureDir(layoutDir);
      ensureDir(valuesDir);
      ensureDir(drawableDir);

      writeIfMissing(
        path.join(xmlDir, 'hora_widget_info.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="90dp"
    android:targetCellWidth="4"
    android:targetCellHeight="2"
    android:updatePeriodMillis="1800000"
    android:initialLayout="@layout/hora_widget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
`,
      );

      writeIfMissing(
        path.join(layoutDir, 'hora_widget.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center_vertical"
    android:padding="16dp"
    android:background="@drawable/hora_widget_background">

    <TextView
        android:id="@+id/hora_widget_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/hora_widget_title"
        android:textColor="#FFF8EA"
        android:textSize="13sp"
        android:textStyle="bold" />

    <TextView
        android:id="@+id/hora_widget_hora"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:text="@string/hora_widget_placeholder"
        android:textColor="#FFF8EA"
        android:textSize="26sp"
        android:textStyle="bold" />

    <TextView
        android:id="@+id/hora_widget_time"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="3dp"
        android:text="@string/hora_widget_time_placeholder"
        android:textColor="#F1B84B"
        android:textSize="13sp" />
</LinearLayout>
`,
      );

      writeIfMissing(
        path.join(drawableDir, 'hora_widget_background.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#2A2119" />
    <corners android:radius="24dp" />
</shape>
`,
      );

      const stringsPath = path.join(valuesDir, 'strings.xml');
      if (fs.existsSync(stringsPath)) {
        const strings = fs.readFileSync(stringsPath, 'utf8');
        let nextStrings = strings;

        if (!strings.includes('name="hora_widget_title"')) {
          nextStrings = nextStrings.replace(
            '</resources>',
            '    <string name="hora_widget_title">Current Hora</string>\n</resources>',
          );
        }

        if (!nextStrings.includes('name="hora_widget_placeholder"')) {
          nextStrings = nextStrings.replace(
            '</resources>',
            '    <string name="hora_widget_placeholder">Hora Detector</string>\n</resources>',
          );
        }

        if (!nextStrings.includes('name="hora_widget_time_placeholder"')) {
          nextStrings = nextStrings.replace(
            '</resources>',
            '    <string name="hora_widget_time_placeholder">Open app to update</string>\n</resources>',
          );
        }

        fs.writeFileSync(stringsPath, nextStrings);
      }

      return modConfig;
    },
  ]);
}

module.exports = withAndroidHoraWidget;
