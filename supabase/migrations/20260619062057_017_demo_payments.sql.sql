-- Create sample payments that are succeeded
INSERT INTO payments (
    registration_id, user_id, amount, currency, status, payment_method, created_at
)
SELECT 
    r.id,
    r.user_id,
    r.amount_paid,
    'INR',
    'succeeded',
    CASE WHEN random() < 0.7 THEN 'card' ELSE 'upi' END,
    NOW() - (random() * 30 * interval '1 day')
FROM registrations r
WHERE r.amount_paid > 0
AND r.payment_status = 'completed'
AND NOT EXISTS (
    SELECT 1 FROM payments p WHERE p.registration_id = r.id
);

-- Also mark pending payments for free events as completed
UPDATE registrations 
SET payment_status = 'completed' 
WHERE amount_paid = 0 AND payment_status = 'pending';