// seedDemoData.js
// Script to seed demo data into Supabase

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const seedEquipment = async () => {
    const equipment = [
        { name: 'MacBook Pro 16"', category: 'Laptop', status: 'available', serial_number: 'MBP-001' },
        { name: 'Dell Monitor 27"', category: 'Monitor', status: 'available', serial_number: 'MON-001' },
        { name: 'Sony Camera A7IV', category: 'Camera', status: 'in_use', serial_number: 'CAM-001' },
    ];

    const { data, error } = await supabase.from('equipment').insert(equipment);

    if (error) {
        console.error('Error seeding equipment:', error);
    } else {
        console.log('Equipment seeded successfully:', data);
    }
};

const main = async () => {
    console.log('Starting demo data seed...');
    await seedEquipment();
    console.log('Demo data seeding complete!');
};

main();
