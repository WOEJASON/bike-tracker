const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const db = admin.firestore();

exports.handler = async () => {
  try {
    console.log('Fetching weekly_data');
    const weeklySnapshot = await db.collection('weekly_data').get();
    const weeklyData = weeklySnapshot.docs.map(doc => ({ weekId: doc.id, ...doc.data() }));
    console.log('weekly_data:', weeklyData);

    console.log('Fetching attendance_bonus');
    const bonusSnapshot = await db.collection('attendance_bonus').doc('current').get();
    const bonusData = bonusSnapshot.exists ? { weekId: 'attendanceBonus', value: bonusSnapshot.data().value } : { weekId: 'attendanceBonus', value: 20 };
    console.log('attendance_bonus:', bonusData);

    const allData = [...weeklyData, bonusData];
    console.log('Returning data:', allData);

    return {
      statusCode: 200,
      body: JSON.stringify(allData),
    };
  } catch (error) {
    console.error('Error in getData:', error.message, error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};