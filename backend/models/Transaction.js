// Transaction model for premium listings and other payments
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['premium_listing', 'subscription', 'featured_property', 'donation'],
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide transaction amount'],
        min: [0, 'Amount cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'CDF']
    },
    stripePaymentIntentId: String,
    stripeSessionId: String,
    stripeCustomerId: String,
    status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'canceled'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'mobile_money', 'bank_transfer', 'cash'],
        default: 'card'
    },
    receiptUrl: String,
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: String,
    metadata: {
        type: Map,
        of: String
    },
    completedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
transactionSchema.index({ user: 1 });
transactionSchema.index({ property: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: -1 });

// Static method to get user's transaction history
transactionSchema.statics.getUserTransactions = function(userId, limit = 10) {
    return this.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('property', 'title location.address');
};

// Static method to get revenue by type
transactionSchema.statics.getRevenueByType = async function(startDate, endDate) {
    return await this.aggregate([
        {
            $match: {
                status: 'succeeded',
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);
};

// Method to mark as completed
transactionSchema.methods.markCompleted = async function() {
    this.status = 'succeeded';
    this.completedAt = new Date();
    return await this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema);
