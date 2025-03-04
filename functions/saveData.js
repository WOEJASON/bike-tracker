const admin = require('firebase-admin');
require('dotenv').config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const weekId = data.weekId;

    if (weekId === 'attendanceBonus') {
      await db.collection('attendance_bonus').doc('current').set({ value: data.value });
    } else {
      await db.collection('weekly_data').doc(weekId).set(data);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data saved' }),
    };
  } catch (error) {
    console.error('Error in saveData:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};