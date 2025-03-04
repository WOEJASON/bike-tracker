const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const { weekId } = JSON.parse(event.body);
    await db.collection('weekly_data').doc(weekId).delete();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Week deleted' }),
    };
  } catch (error) {
    console.error('Error in deleteData:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};