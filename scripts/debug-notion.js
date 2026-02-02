const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function testCreate() {
    try {
        console.log('🧪 Test de création dans Notion...\n');

        // Essayer avec "Identité" comme titre
        const result = await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_ID
            },
            properties: {
                'Identité': {
                    title: [{
                        text: { content: 'TEST - À SUPPRIMER' }
                    }]
                }
            }
        });

        console.log('✅ Succès! Page créée avec ID:', result.id);
        console.log('\n📋 TOUTES les propriétés de ta database:');
        Object.entries(result.properties).forEach(([name, prop]) => {
            console.log(`  ✓ "${name}" (${prop.type})`);
        });

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

testCreate();
