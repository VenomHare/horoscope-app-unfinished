Note: The following changes are requested after testing app development build on Android. No Testing for IOS was performed

# Fixes
- The widget for showing active hora and details is not appearing in widgets menu of Andriod.
- If the sticky Notification is cleared from notifications it doesn't reappear. On Lockscreen it cannot be removed yet when phone is unlocked user can clear it. So add refreshing logic which makes sure that notification is in notifications and if not then add it again
- Implemet logic where the app won't get cleared by clearing recent apps. The goal is to keep updating notifactions and widget.
- In permissions mention that we require location to get precise sunrise time also update locales 
- update the hora name to update with languages
- The Start and end notifaction should be like "X Hora is ending/starting in y minutes" 

# Theme 
The current theme is very good in terms of structure although the colors can be managed better
1. If the phone is in dark mode use Dark theme else light
2. The color for Every hora looks good in currnet hora card although in Hora table it looks too goddy. so in Hora table make it use a same color and show the specific color if highlighted
3. The active tab color is white, which makes icon invisible on white background.
4. Icons are too sharp add some rounded or smooth icons


