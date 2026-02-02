const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

async function testFullPageCreation() {
    console.log('🧪 TEST CRÉATION PAGE COMPLÈTE (comme l\'API)\n');
    console.log('================================================\n');

    const dbId = process.env.NOTION_DATABASE_ID;

    // Simuler les données du formulaire
    const formData = {
        name: '🧪 Test Complet - À SUPPRIMER',
        company: 'Test Structure',
        email: 'test@debug.com',
        ambition: 'Fondation',  // Valeur du formulaire
        context: 'Test de création complète depuis le script de debug'
    };

    console.log('📋 DONNÉES DE TEST (simulent le formulaire) :');
    console.log(JSON.stringify(formData, null, 2));
    console.log('\n');

    // Payload exactement comme dans route.ts
    const notionPayload = {
        parent: {
            database_id: dbId
        },
        properties: {
            'Identité': {
                title: [{ text: { content: formData.name } }]
            },
            'Structure': {
                rich_text: [{ text: { content: formData.company || '-' } }]
            },
            'Email': {
                email: formData.email
            },
            'Ambition': {
                select: { name: formData.ambition || 'Autre' }
            },
            'Contexte': {
                rich_text: [{ text: { content: formData.context || '-' } }]
            },
            'Date': {
                date: { start: new Date().toISOString() }
            },
            'Statut': {
                select: { name: 'Nouveau' }
            }
        }
    };

    console.log('📤 PAYLOAD NOTION :');
    console.log(JSON.stringify(notionPayload, null, 2));
    console.log('\n');

    try {
        console.log('⏳ Création de la page...\n');

        const result = await notion.pages.create(notionPayload);

        console.log('✅ SUCCÈS !');
        console.log('   Page ID:', result.id);
        console.log('   URL:', result.url);
        console.log('\n');

        console.log('================================================');
        console.log('🎉 LA CRÉATION FONCTIONNE PARFAITEMENT !');
        console.log('');
        console.log('⚠️  VA SUPPRIMER CETTE ENTRÉE TEST SUR NOTION');
        console.log('================================================\n');

        console.log('💡 CONCLUSION :');
        console.log('   Le code est correct. Le problème est probablement :');
        console.log('   1. Variables d\'environnement mal configurées sur Vercel');
        console.log('   2. Ou les valeurs "Ambition" envoyées par le formulaire');
        console.log('      ne correspondent pas aux options dans Notion');
        console.log('');
        console.log('   Pour vérifier, regarde les logs Vercel après une soumission.');
        console.log('\n');

    } catch (error) {
        console.error('❌ ERREUR DE CRÉATION\n');
        console.error('Message:', error.message);
        console.error('Code:', error.code);

        if (error.body) {
            console.error('\nDétails:', JSON.stringify(error.body, null, 2));
        }

        console.log('\n🔍 DIAGNOSTIC :');

        if (error.message.includes('select')) {
            console.log('\n❌ Problème avec une propriété SELECT');
            console.log('   Les valeurs possibles ne correspondent pas.');
            console.log('   Vérifie dans Notion les options pour "Ambition" et "Statut".');
        }

        console.log('\n');
    }
}

testFullPageCreation();
