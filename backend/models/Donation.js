// Donation model for tracking community donations
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please provide donation amount'],
        min: [50, 'Minimum donation is $0.50']
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'CDF']
    },
    donor: {
        name: String,
        email: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        isAnonymous: {
            type: Boolean,
            default: false
        }
    },
    stripePaymentIntentId: {
        type: String,
        required: true,
        unique: true
    },
    stripeSessionId: String,
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'refunded'],
        default: 'pending'
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    dedicatedTo: {
        type: String,
        maxlength: [100, 'Dedication cannot exceed 100 characters']
    },
    receiptEmail: String,
    receiptUrl: String,
    metadata: {
        type: Map,
        of: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
donationSchema.index({ status: 1 });
donationSchema.index({ 'donor.userId': 1 });
donationSchema.index({ createdAt: -1 });

// Static method to get total donations
donationSchema.statics.getTotalDonations = async function() {
    const result = await this.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result[0]?.total || 0;
};

// Static method to get donations by date range
donationSchema.statics.getDonationsByDateRange = function(startDate, endDate) {
    return this.find({
        status: 'succeeded',
        createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Donation', donationSchema);
