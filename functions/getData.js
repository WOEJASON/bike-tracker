const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json')),
  });
}

const db = admin.firestore();

exports.handler = async () => {
  try {
    const weeklySnapshot = await db.collection('weekly_data').get();
    const weeklyData = weeklySnapshot.docs.map(doc => ({ weekId: doc.id, ...doc.data() }));

    const bonusSnapshot = await db.collection('attendance_bonus').doc('current').get();
    const bonusData = bonusSnapshot.exists ? { weekId: 'attendanceBonus', value: bonusSnapshot.data().value } : { weekId: 'attendanceBonus', value: 20 };

    const allData = [...weeklyData, bonusData];

    return {
      statusCode: 200,
      body: JSON.stringify(allData),
    };
  } catch (error) {
    console.error('Error in getData:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};