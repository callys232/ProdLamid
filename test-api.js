
const BASE_URL = 'http://localhost:3001/api/projects';

async function testEndpoints() {
    try {
        console.log('--- Testing GET /api/projects ---');
        const resList = await fetch(BASE_URL);
        if (resList.ok) {
            const data = await resList.json();
            console.log('Success, count:', data.length);
        } else {
            console.error('Failed:', resList.status);
        }

        console.log('\n--- Testing GET /api/projects/tp1 ---');
        const resItem = await fetch(`${BASE_URL}/tp1`);
        if (resItem.ok) {
            const item = await resItem.json();
            console.log('Success, item:', item.title);
        } else {
            console.error('Failed:', resItem.status, await resItem.text());
        }

        console.log('\n--- Testing POST /api/projects/apply ---');
        const resApply = await fetch(`${BASE_URL}/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                amount: '5000',
                timeline: '2 weeks',
                projectId: 'tp1'
            })
        });
        if (resApply.ok) {
            console.log('Success:', await resApply.json());
        } else {
            console.error('Failed:', resApply.status, await resApply.text());
        }

        console.log('\n--- Testing POST /api/projects/save ---');
        const resSave = await fetch(`${BASE_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId: 'tp1', action: 'save' })
        });
        if (resSave.ok) {
            console.log('Success:', await resSave.json());
        } else {
            console.error('Failed:', resSave.status, await resSave.text());
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

testEndpoints();
