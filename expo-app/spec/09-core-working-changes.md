# Current Behaviour 
App calls the sunrise api to get sunrise time everytime we refresh. 
App is also recalculating the whole table on every refresh

# Expected Behavior
- App should calculate first time when opened if not already cached or cached table expired 
- Once calculated it should store the table and timestamp of recalculation whenever user requests data compare if the current time has past that time table if yes recalculate else show cached data
- If user pulls down dashboard to refresh then only it should hard refresh other than that  it should use cache
- So now when user will open app, he will calculate horas for whole day and it will get cached after that whenever he loads he see's cached data until next day he opens and the cached data is expired and data recalculates and the whole process repeats


# Notifications Changes
- Schedule the start and end alert using scheduleNotificationAsync() so that even if the app is off it would work
- Make sure to manage those notifications if user changes prefreneces the notifactions should be altered accordingly

# Widget Updations
- Since we have table already if possible schedule widgets update as well

# Recalculations
- If possible schedule recalulations for the next day

