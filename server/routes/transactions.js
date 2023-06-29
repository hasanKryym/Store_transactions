const express = require('express');
const { getTransactions, addTransactions, addDraft, getTransactionsDraft, deleteTranscationDraft, editTranscationDraft } = require('../controllers/transactions');

const router = express.Router();


router.route('/').get(getTransactions).post(addTransactions)
router.route('/draft').post(addDraft).get(getTransactionsDraft)
router.route('/draft/:id').delete(deleteTranscationDraft).patch(editTranscationDraft)


module.exports = router;