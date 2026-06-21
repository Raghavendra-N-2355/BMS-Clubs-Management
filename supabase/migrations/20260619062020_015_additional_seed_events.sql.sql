-- Add more seed events with future dates for demo
-- These are created by the demo admin user

-- Get club IDs for reference
DO $$
DECLARE
    acm_club UUID;
    ieeecs_club UUID;
    coders_club UUID;
    ai_club UUID;
    webdev_club UUID;
    robotics_club UUID;
    drama_club UUID;
    music_club UUID;
    admin_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
    admin_dept UUID;
BEGIN
    -- Get admin department
    SELECT id INTO admin_dept FROM departments WHERE code = 'CSE' LIMIT 1;
    
    -- Get club IDs
    SELECT id INTO acm_club FROM clubs WHERE name LIKE '%ACM%' LIMIT 1;
    SELECT id INTO ieeecs_club FROM clubs WHERE name LIKE '%IEEE%' LIMIT 1;
    SELECT id INTO coders_club FROM clubs WHERE name LIKE '%Coders%' LIMIT 1;
    SELECT id INTO ai_club FROM clubs WHERE name LIKE '%AI/Machine%' LIMIT 1;
    SELECT id INTO webdev_club FROM clubs WHERE name LIKE '%Web Development%' LIMIT 1;
    SELECT id INTO robotics_club FROM clubs WHERE name LIKE '%Robotics%' LIMIT 1;
    SELECT id INTO drama_club FROM clubs WHERE name LIKE '%Drama%' LIMIT 1;
    SELECT id INTO music_club FROM clubs WHERE name LIKE '%Music%' LIMIT 1;

    -- Update existing events to have future dates and add more events
    UPDATE events SET 
        event_date = CURRENT_DATE + 15,
        is_approved = true,
        is_active = true,
        created_by = admin_id
    WHERE id IN (
        SELECT id FROM events WHERE title = 'AI/ML Workshop Series' LIMIT 1
    );

    -- Insert additional upcoming events
    INSERT INTO events (
        title, description, club_id, department_id, category, event_type,
        venue, event_date, start_time, end_time,
        registration_fee, max_participants, current_participants,
        is_approved, is_active, is_registration_open, created_by, tags
    ) VALUES
    (
        'Full Stack Web Development Bootcamp',
        'A comprehensive 3-day bootcamp covering modern web development technologies including React, Node.js, and MongoDB. Perfect for beginners and intermediate developers looking to level up their skills.',
        webdev_club,
        admin_dept,
        'workshop',
        'offline',
        'Seminar Hall A, CS Block',
        CURRENT_DATE + 7,
        '09:00',
        '17:00',
        299,
        150,
        87,
        true,
        true,
        true,
        admin_id,
        ARRAY['web development', 'react', 'nodejs', 'mongodb', 'full stack']
    ),
    (
        'Hackathon 2024 - Build the Future',
        '24-hour hackathon where teams compete to build innovative solutions. Theme: Sustainable Technology. Prizes worth Rs. 1 Lakh! Food and refreshments provided.',
        coders_club,
        admin_dept,
        'hackathon',
        'offline',
        'Innovation Hub, BMSCE',
        CURRENT_DATE + 21,
        '08:00',
        '20:00',
        0,
        200,
        145,
        true,
        true,
        true,
        admin_id,
        ARRAY['hackathon', 'innovation', 'sustainability', 'team event']
    ),
    (
        'Robotics Competition - RoboWars',
        'Annual robotics competition featuring line followers, obstacle avoidance, and combat robots. Teams from across Bangalore participate!',
        robotics_club,
        admin_dept,
        'competition',
        'offline',
        'Sports Complex, BMSCE',
        CURRENT_DATE + 30,
        '10:00',
        '18:00',
        500,
        50,
        32,
        true,
        true,
        true,
        admin_id,
        ARRAY['robotics', 'competition', 'engineering', 'automation']
    ),
    (
        'Tech Talk: Future of AI in Healthcare',
        'Industry experts discuss how AI is revolutionizing healthcare diagnostics, treatment planning, and patient care. Networking session included.',
        ai_club,
        admin_dept,
        'seminar',
        'hybrid',
        'Conference Room A + Online',
        CURRENT_DATE + 5,
        '14:00',
        '16:30',
        0,
        300,
        178,
        true,
        true,
        true,
        admin_id,
        ARRAY['AI', 'healthcare', 'tech talk', 'industry']
    ),
    (
        'Cloud Computing Workshop - AWS Basics',
        'Hands-on workshop covering AWS fundamentals including EC2, S3, Lambda, and more. Get cloud-certified!',
        ieeecs_club,
        admin_dept,
        'workshop',
        'online',
        NULL,
        CURRENT_DATE + 12,
        '10:00',
        '14:00',
        199,
        100,
        65,
        true,
        true,
        true,
        admin_id,
        ARRAY['cloud', 'AWS', 'devops', 'workshop']
    ),
    (
        'Cultural Night - Rhapsody 2024',
        'Annual cultural fest featuring music, dance, and drama performances. Food stalls and art exhibitions included.',
        drama_club,
        admin_dept,
        'cultural',
        'offline',
        'Open Air Auditorium',
        CURRENT_DATE + 25,
        '18:00',
        '22:00',
        100,
        500,
        342,
        true,
        true,
        true,
        admin_id,
        ARRAY['cultural', 'music', 'dance', 'fest']
    ),
    (
        'Data Science Masterclass',
        'Learn data analysis, visualization, and machine learning fundamentals using Python. Certificate provided.',
        acm_club,
        admin_dept,
        'technical',
        'offline',
        'Lab 101, CS Block',
        CURRENT_DATE + 10,
        '09:00',
        '13:00',
        149,
        80,
        56,
        true,
        true,
        true,
        admin_id,
        ARRAY['data science', 'python', 'machine learning', 'analysis']
    ),
    (
        'Open Mic Night',
        'Showcase your talent! Sing, perform poetry, or play music. All skill levels welcome. Refreshments available.',
        music_club,
        admin_dept,
        'cultural',
        'offline',
        'Cafeteria Amphitheater',
        CURRENT_DATE + 3,
        '17:30',
        '20:00',
        0,
        150,
        89,
        true,
        true,
        true,
        admin_id,
        ARRAY['music', 'open mic', 'talent', 'performance']
    ),
    (
        'Coding Interview Prep Session',
        'Practice coding problems, learn interview strategies, and get tips from FAANG engineers.',
        coders_club,
        admin_dept,
        'workshop',
        'hybrid',
        'Room 205, CS Block',
        CURRENT_DATE + 8,
        '15:00',
        '18:00',
        0,
        120,
        78,
        true,
        true,
        true,
        admin_id,
        ARRAY['coding', 'interview', 'placement', 'DSA']
    ),
    (
        'Blockchain & Web3 Workshop',
        'Introduction to blockchain technology, smart contracts, and building dApps. No prior experience required.',
        ieeecs_club,
        admin_dept,
        'workshop',
        'offline',
        'Seminar Hall B, CS Block',
        CURRENT_DATE + 18,
        '10:00',
        '16:00',
        249,
        100,
        54,
        true,
        true,
        true,
        admin_id,
        ARRAY['blockchain', 'web3', 'smart contracts', 'dApps']
    )
    ON CONFLICT DO NOTHING;
END $$;