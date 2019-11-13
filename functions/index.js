/* eslint-disable no-await-in-loop */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const db = admin.firestore();

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

const getAdmins = async () => {
  const adminsQuerySnapshot = await db.collection('admins').get();
  const adminsStatus = adminsQuerySnapshot.docs.reduce((acc, cur) => ({
    ...acc,
    [cur.id]: cur.data().admin,
  }), {});
  const admins = [];
  for (const [key, value] of Object.entries(adminsStatus)) {
    if (value) {
      const adminDataDoc = await db.collection('users').doc(key).get();
      const { email, displayName } = adminDataDoc.data();
      admins.push({
        email,
        displayName,
      });
    }
  }
  return admins;
};

exports.newUserEmails = functions.auth.user().onCreate(async (user) => {
  const admins = await getAdmins();
  const emails = await Promise.all(admins.map(el => ({
    to: el.email,
    from: 'no-reply@yscfoh.com',
    subject: 'Clickr - New User',
    templateId: 'd-6ead4d786f4e4102826c1f14dc2fe414',
    dynamic_template_data: {
      name: el.displayName,
      newUser: user.email,
    },
  })));
  await sgMail.send(emails);
});
