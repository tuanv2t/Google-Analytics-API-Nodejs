'use strict'

const { google } = require('googleapis')

const key = require('./google_auth.json')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)
const view_id = '[your_view_id]'

process.env.GOOGLE_APPLICATION_CREDENTIALS = './google_auth.json'


const defaultCredential = {
  'auth': jwt,
  'ids': 'ga:' + view_id,
}



async function main() {
  

  /*Get the number of today sessions*/
  const sessionTodayData = await google.analytics('v3').data.ga.get({
    ...defaultCredential,
    'start-date': 'today',
    'end-date': 'today',
    'metrics': 'ga:sessions'
  });
  console.log(sessionTodayData);
/* Get the number of today sessions coming from organic sources (Search Engines) */
  const todaySessionsComingFromOrganicData = await google.analytics('v3').data.ga.get({
    ...defaultCredential,
    'start-date': 'today',
    'end-date': 'today',
    'metrics': 'ga:sessions',
    'filters': 'ga:medium==organic',
  });
  console.log(todaySessionsComingFromOrganicData);
  console.dir(todaySessionsComingFromOrganicData.data.rows[0][0])
  /* Get the number of sessions in the last 30 days */
  const sessionLast30Data = await google.analytics('v3').data.ga.get({
    ...defaultCredential,
    'start-date': '30daysAgo',
    'end-date': 'today',
    'metrics': 'ga:sessions'
  });
  console.log(sessionLast30Data);
  console.dir(sessionLast30Data.data.rows[0][0])
/* Get the browsers used in the last 30 days */
const browserLast30Data = await google.analytics('v3').data.ga.get({
  ...defaultCredential,
  'start-date': '30daysAgo',
  'end-date': 'today',
  'dimensions': 'ga:browser',
  'metrics': 'ga:sessions'
});
console.log(browserLast30Data);
console.dir(browserLast30Data.data.rows.sort((a, b) => b[1] - a[1]))

/* Get the number of visitors using Chrome */
const chromeLast30Data = await google.analytics('v3').data.ga.get({
  ...defaultCredential,
  'start-date': '30daysAgo',
  'end-date': 'today',
  'dimensions': 'ga:browser',
  'metrics': 'ga:sessions',
  'filters': 'ga:browser==Chrome',
});
console.log(chromeLast30Data);
console.dir(browserLast30Data.data.rows.sort((a, b) => b[1] - a[1]))

/* Get the sessions by traffic source */

const trafficSourceLast30Data = await google.analytics('v3').data.ga.get({
  ...defaultCredential,
  'start-date': '30daysAgo',
  'end-date': 'today',
  'dimensions': 'ga:source',
  'metrics': 'ga:sessions'
})

console.dir(trafficSourceLast30Data.data.rows.sort((a, b) => b[1] - a[1]))


}

main()