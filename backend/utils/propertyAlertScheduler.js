const User = require('../models/User');
const Property = require('../models/Property');
const { sendEmail } = require('./emailService');
const { buildPropertyQuery } = require('./buildPropertyQuery');

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const DEFAULT_INTERVAL_MS = 15 * 60 * 1000;

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function isFrequencyDue(alert, now = new Date()) {
    if (!alert.lastNotifiedAt) return true;

    const elapsed = now.getTime() - new Date(alert.lastNotifiedAt).getTime();

    switch (alert.frequency) {
        case 'weekly':
            return elapsed >= WEEK_MS;
        case 'daily':
            return elapsed >= DAY_MS;
        case 'instant':
        default:
            return true;
    }
}

function buildAlertMatchQuery(alert) {
    const savedFilters = alert.query || {};
    const propertyQuery = buildPropertyQuery(savedFilters);
    const since = alert.lastNotifiedAt || alert.createdAt || new Date();

    // Alerts should only notify for active listings unless the user/admin saved
    // a specific status filter.
    if (!propertyQuery.status) {
        propertyQuery.status = 'active';
    }

    return {
        $and: [
            propertyQuery,
            {
                $or: [
                    { createdAt: { $gt: since } },
                    { updatedAt: { $gt: since } }
                ]
            }
        ]
    };
}

function formatPrice(property) {
    const currency = property.currency || 'USD';
    const price = Number(property.price || 0).toLocaleString();
    return `${currency} ${price}`;
}

function getPropertyUrl(property) {
    const frontendUrl = (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
    return `${frontendUrl}/properties/${property._id}`;
}

function renderAlertEmail(user, alert, properties) {
    const propertyItems = properties.map((property) => {
        const address = escapeHtml(property.location?.address || property.location?.city || 'Location available on listing');
        const url = escapeHtml(getPropertyUrl(property));

        return `
            <li style="margin-bottom:16px;">
                <strong>${escapeHtml(property.title)}</strong><br/>
                ${escapeHtml(formatPrice(property))} · ${Number(property.bedrooms) || 0} bed · ${Number(property.bathrooms) || 0} bath<br/>
                ${address}<br/>
                <a href="${url}">View property</a>
            </li>
        `;
    }).join('');

    const greeting = escapeHtml(user.firstName || user.username || 'there');
    const alertName = escapeHtml(alert.name);
    const moreCount = properties.length >= 10 ? '<p>There may be more matching listings in your search results.</p>' : '';

    return {
        subject: `New matches for "${alert.name}" on futelatosomba`,
        html: `
            <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
                <h2>New property matches</h2>
                <p>Hello ${greeting},</p>
                <p>We found ${properties.length} new or updated listing${properties.length === 1 ? '' : 's'} matching your alert <strong>${alertName}</strong>.</p>
                <ul style="padding-left:20px;">${propertyItems}</ul>
                ${moreCount}
                <p>You can manage alerts from your futelatosomba dashboard.</p>
            </div>
        `,
        text: [
            `Hello ${greeting},`,
            `We found ${properties.length} new or updated listings matching "${alert.name}".`,
            ...properties.map((property) => `${property.title} - ${formatPrice(property)} - ${getPropertyUrl(property)}`),
            'Manage alerts from your futelatosomba dashboard.'
        ].join('\n')
    };
}

async function processPropertyAlerts({ dryRun = false, now = new Date() } = {}) {
    const users = await User.find({
        'propertyAlerts.0': { $exists: true },
        email: { $exists: true, $ne: '' }
    });

    const summary = {
        usersChecked: users.length,
        alertsChecked: 0,
        emailsSent: 0,
        matchedProperties: 0,
        errors: []
    };

    for (const user of users) {
        let userChanged = false;

        for (const alert of user.propertyAlerts) {
            summary.alertsChecked += 1;

            if (!isFrequencyDue(alert, now)) continue;

            try {
                const matchQuery = buildAlertMatchQuery(alert);
                const properties = await Property.find(matchQuery)
                    .sort({ updatedAt: -1, createdAt: -1 })
                    .limit(10)
                    .populate('owner', 'username firstName lastName agencyName phone email');

                if (properties.length === 0) continue;

                summary.matchedProperties += properties.length;

                if (!dryRun) {
                    const email = renderAlertEmail(user, alert, properties);
                    await sendEmail({
                        to: user.email,
                        subject: email.subject,
                        html: email.html,
                        text: email.text
                    });

                    alert.lastNotifiedAt = now;
                    userChanged = true;
                    summary.emailsSent += 1;
                }
            } catch (error) {
                const message = `Alert ${alert._id} for user ${user._id}: ${error.message}`;
                console.error('[PropertyAlerts]', message);
                summary.errors.push(message);
            }
        }

        if (userChanged) {
            await user.save();
        }
    }

    return summary;
}

function startPropertyAlertScheduler() {
    const intervalMs = Number(process.env.PROPERTY_ALERT_INTERVAL_MS || DEFAULT_INTERVAL_MS);

    if (process.env.DISABLE_PROPERTY_ALERTS === 'true') {
        console.log('[PropertyAlerts] Scheduler disabled by DISABLE_PROPERTY_ALERTS=true');
        return null;
    }

    const run = async () => {
        try {
            const summary = await processPropertyAlerts();
            if (summary.emailsSent || summary.errors.length) {
                console.log('[PropertyAlerts] Run summary:', summary);
            }
        } catch (error) {
            console.error('[PropertyAlerts] Scheduler run failed:', error);
        }
    };

    const timer = setInterval(run, intervalMs);
    timer.unref?.();
    console.log(`[PropertyAlerts] Scheduler started; interval=${intervalMs}ms`);
    return timer;
}

module.exports = {
    processPropertyAlerts,
    startPropertyAlertScheduler,
    isFrequencyDue,
    buildAlertMatchQuery,
    escapeHtml,
    renderAlertEmail
};
