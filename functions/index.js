const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.firestoreEmail = functions.firestore.document('users/{userId}').onCreate(async (event, context) => {
  const userId = context.params.userId;
  const db = admin.firestore();
  const emails = [];
  const userDoc = await db.collection('users').doc(userId).get();
  const user = userDoc.data();
  const allAdmins = await db.collection('admins').get();
  await Promise.all(allAdmins.docs.map(async (curAdmin) => {
    const isAdminData = curAdmin.data();
    if (!isAdminData.admin) return;
    const adminDataDoc = await db.collection('users').doc(curAdmin.id).get();
    const { email, displayName } = adminDataDoc.data();
    emails.push({
      to: email,
      from: 'no-reply@yscfoh.com',
      subject: 'Clickr - New User',
      templateId: 'd-6ead4d786f4e4102826c1f14dc2fe414',
      dynamic_template_data: {
        name: displayName,
        newUser: user.email,
      },
    });
  }));
  await sgMail.send(emails);
});
