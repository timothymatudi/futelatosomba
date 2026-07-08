// One-off migration: trim + lowercase every stored user email so lookups
// match the lowercased input from the validation middleware.
//
// Dry run (default):  node scripts/normalize-emails.js
// Apply changes:      node scripts/normalize-emails.js --apply
//
// Refuses to change anything if two accounts would collide on the same
// lowercased email - those must be resolved manually first.
require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    const apply = process.argv.includes('--apply');
    await mongoose.connect(process.env.MONGO_DATABASE_URL);
    const users = mongoose.connection.db.collection('users');

    const all = await users.find({}, { projection: { email: 1 } }).toArray();
    const needsFix = all.filter(u =>
        typeof u.email === 'string' && u.email !== u.email.trim().toLowerCase());

    const counts = {};
    for (const u of all) {
        const k = String(u.email).trim().toLowerCase();
        counts[k] = (counts[k] || 0) + 1;
    }
    const dupes = Object.keys(counts).filter(k => counts[k] > 1);

    console.log(`${all.length} users, ${needsFix.length} emails to normalize, ${dupes.length} collisions`);
    if (dupes.length) {
        dupes.forEach(k => console.log(`COLLISION: ${k}`));
        console.log('Aborting - resolve duplicate accounts first.');
        process.exit(1);
    }

    for (const u of needsFix) {
        const fixed = u.email.trim().toLowerCase();
        console.log(`${apply ? 'FIXING' : 'would fix'}: ${u.email} -> ${fixed}`);
        if (apply) {
            await users.updateOne({ _id: u._id }, { $set: { email: fixed } });
        }
    }
    console.log(apply ? 'Done.' : 'Dry run only - rerun with --apply to write changes.');
    await mongoose.disconnect();
})().catch(err => { console.error(err); process.exit(1); });
